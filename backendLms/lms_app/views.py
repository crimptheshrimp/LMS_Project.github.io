from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AssignmentCourse, Course, Enrollment, LectureCourse, QuizCourse
from .serializers import (
    AssignmentCourseSerializer,
    CourseSerializer,
    EnrollmentSerializer,
    LectureCourseSerializer,
    LoginSerializer,
    QuizCourseSerializer,
    UserRegistrationSerializer,
)


class IsInstructorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in {"instructor", "admin"}


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
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CourseEnrollView(APIView):
    permission_classes = [permissions.IsAuthenticated]

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
