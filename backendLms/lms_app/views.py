from django.contrib.auth import login, logout
from datetime import timedelta
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AssignmentCourse, Course, CustomUser, Enrollment, LectureCourse, Notification, QuizCourse
from .serializers import (
    AssignmentCourseSerializer,
    CourseSerializer,
    EnrollmentSerializer,
    LectureCourseSerializer,
    LoginSerializer,
    QuizCourseSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    NotificationSerializer,
    UserRoleSerializer,
)


def course_terms(course):
    words = f"{course.title} {course.description}".lower().split()
    return {word.strip(".,!?;:") for word in words if len(word.strip(".,!?;:")) > 3}


class IsInstructorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in {"instructor", "admin"}


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "student")


class IsCourseEditor(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in {"instructor", "admin"})

    def has_object_permission(self, request, view, obj):
        return request.user.role == "admin" or obj.instructor_id == request.user.id


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User registered successfully",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "role": user.role,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            return Response(
                {
                    "message": "Login successful",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "role": user.role,
                    },
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CurrentUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"user": None}, status=status.HTTP_200_OK)

        user = request.user
        return Response(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                },
            }
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class NotificationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        Notification.objects.filter(created_at__lt=timezone.now() - timedelta(days=2)).delete()
        return Notification.objects.filter(recipient=self.request.user)


class NotificationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationSerializer
    http_method_names = ["get", "patch"]

    def get_permissions(self):
        return [IsInstructorOrAdmin()] if self.request.method == "PATCH" else [permissions.IsAuthenticated()]

    def get_queryset(self):
        Notification.objects.filter(created_at__lt=timezone.now() - timedelta(days=2)).delete()
        return Notification.objects.filter(recipient=self.request.user)


class UserManagementView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        return CustomUser.objects.all().order_by("username")


class UserRoleUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = UserRoleSerializer
    queryset = CustomUser.objects.all()
    http_method_names = ["patch"]

    def perform_update(self, serializer):
        user = serializer.save()
        Notification.objects.bulk_create(
            [
                Notification(recipient=recipient, message=f"{user.username} is now a {user.get_role_display().lower()}.")
                for recipient in CustomUser.objects.filter(role__in=["instructor", "admin"]).exclude(pk=user.pk)
            ]
        )


class CourseListView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsInstructorOrAdmin()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(instructor=request.user)
        course = serializer.instance
        recipients = CustomUser.objects.filter(role__in=["instructor", "admin"]).exclude(pk=request.user.pk)
        Notification.objects.bulk_create(
            [Notification(recipient=user, message=f"New course available: {course.title}.") for user in recipients]
        )
        enrolled_students = CustomUser.objects.filter(enrollments__course__isnull=False).prefetch_related("enrollments__course").distinct()
        Notification.objects.bulk_create(
            [
                Notification(recipient=student, message=f"New course related to your current learning: {course.title}.")
                for student in enrolled_students
                if any(course_terms(course) & course_terms(current.course) for current in student.enrollments.all())
            ]
        )
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.request.method in {"PUT", "PATCH", "DELETE"}:
            return [IsCourseEditor()]
        return [permissions.AllowAny()]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method in {"PUT", "PATCH", "DELETE"} and not IsCourseEditor().has_object_permission(request, self, obj):
            self.permission_denied(request, message="You can only alter your own courses.")


class CourseEnrollView(APIView):
    permission_classes = [IsStudent]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

        enrollment, created = Enrollment.objects.get_or_create(student=request.user, course=course)

        if not created:
            return Response(
                {
                    "message": "Already enrolled in this course.",
                    "course_id": course.pk,
                    "student_id": request.user.pk,
                },
                status=status.HTTP_200_OK,
            )

        Notification.objects.create(
            recipient=request.user,
            message=f"You started {course.title}. Keep going and track your progress.",
        )

        return Response(
            {
                "message": "Enrollment successful.",
                "course_id": course.pk,
                "student_id": request.user.pk,
                "enrollment_id": enrollment.pk,
            },
            status=status.HTTP_201_CREATED,
        )


class StudentEnrollmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(student=request.user).select_related("course", "course__instructor")
        data = []
        for enrollment in enrollments:
            data.append(
                {
                    "id": enrollment.course.id,
                    "title": enrollment.course.title,
                    "description": enrollment.course.description,
                    "instructor": str(enrollment.course.instructor),
                    "enrolled_at": enrollment.enrolled_at.isoformat(),
                }
            )
        return Response(data, status=status.HTTP_200_OK)


class LectureCourseListView(generics.ListAPIView):
    queryset = LectureCourse.objects.all()
    serializer_class = LectureCourseSerializer
    permission_classes = [permissions.AllowAny]


class QuizCourseListView(generics.ListAPIView):
    queryset = QuizCourse.objects.all()
    serializer_class = QuizCourseSerializer
    permission_classes = [permissions.AllowAny]


class AssignmentCourseListView(generics.ListAPIView):
    queryset = AssignmentCourse.objects.all()
    serializer_class = AssignmentCourseSerializer
    permission_classes = [permissions.AllowAny]
