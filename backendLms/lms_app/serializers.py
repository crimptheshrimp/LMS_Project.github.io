from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import AssignmentCourse, Course, CustomUser, Enrollment, LectureCourse, Notification, QuizCourse, SubjectTag


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("username", "email", "password", "role")

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role=validated_data.get("role", "student"),
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "role", "mobile_number", "interests", "age")
        read_only_fields = ("id", "username", "role")


class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "role")


class UserAccountUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "mobile_number", "interests", "age", "role", "current_password", "new_password")
        read_only_fields = ("id", "role")

    def validate(self, attrs):
        if "new_password" in attrs:
            current_password = attrs.get("current_password")
            request = self.context.get("request")
            is_admin_reset = request and request.user.role == "admin" and request.user.pk != self.instance.pk and self.instance.role != "admin"
            if not is_admin_reset and (not current_password or not self.instance.check_password(current_password)):
                raise serializers.ValidationError({"current_password": "Enter your current password to set a new password."})
        return attrs

    def update(self, instance, validated_data):
        validated_data.pop("current_password", None)
        new_password = validated_data.pop("new_password", None)
        if new_password:
            instance.set_password(new_password)
        return super().update(instance, validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["username"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        return {"user": user}


class CourseSerializer(serializers.ModelSerializer):
    instructor = serializers.StringRelatedField(read_only=True)
    tags = serializers.SlugRelatedField(
        many=True,
        queryset=SubjectTag.objects.all(),
        required=False,
        slug_field="name",
    )

    class Meta:
        model = Course
        fields = ("id", "title", "description", "estimated_length", "instructor", "created_at", "tags")


class ManagedCourseSerializer(CourseSerializer):
    enrolled_students = serializers.SerializerMethodField()

    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ("enrolled_students",)

    def get_enrolled_students(self, course):
        return [
            {"id": enrollment.student_id, "username": enrollment.student.username}
            for enrollment in course.enrolled_students.select_related("student").all()
        ]


class LectureCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LectureCourse
        fields = ("id", "title", "description", "instructor", "video_url", "duration_minutes")


class QuizCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizCourse
        fields = ("id", "title", "description", "instructor", "passing_score", "question_count")


class AssignmentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentCourse
        fields = ("id", "title", "description", "instructor", "due_date", "submission_type")


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ("id", "student", "course", "enrolled_at")


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "message", "created_at", "read")
