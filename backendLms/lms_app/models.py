from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("instructor", "Instructor"),
        ("admin", "Admin"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    mobile_number = models.CharField(max_length=30, blank=True)
    interests = models.TextField(blank=True)
    age = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return self.username


class SubjectTag(models.Model):
    name = models.CharField(max_length=80, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    instructor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="courses_taught",
    )
    tags = models.ManyToManyField(SubjectTag, blank=True, related_name="courses")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title


class LectureCourse(Course):
    video_url = models.URLField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=0)


class QuizCourse(Course):
    passing_score = models.PositiveIntegerField(default=60)
    question_count = models.PositiveIntegerField(default=0)


class AssignmentCourse(Course):
    due_date = models.DateField(blank=True, null=True)
    submission_type = models.CharField(max_length=50, default="text")


class Enrollment(models.Model):
    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrolled_students",
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["student", "course"], name="unique_student_course_enrollment")
        ]
        ordering = ["-enrolled_at"]

    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"


class Notification(models.Model):
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
