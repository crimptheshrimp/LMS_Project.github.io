from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import AssignmentCourse, Course, CustomUser, Enrollment, LectureCourse, QuizCourse


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

    class Meta:
        model = Course
        fields = ("id", "title", "description", "instructor", "created_at")


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
