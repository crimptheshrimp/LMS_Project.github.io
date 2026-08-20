from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import AssignmentCourse, Course, Enrollment, LectureCourse, QuizCourse


class LMSModelTests(TestCase):
    def test_create_custom_user_and_course_subclasses(self):
        user = get_user_model().objects.create_user(
            username="alice",
            email="alice@example.com",
            password="testpass123",
            role="instructor",
        )

        course = Course.objects.create(
            title="Intro to Django",
            description="A beginner course on Django",
            instructor=user,
        )

        lecture = LectureCourse.objects.create(
            title="Django Basics",
            description="Learn the basics of Django",
            instructor=user,
            video_url="https://example.com/video.mp4",
            duration_minutes=45,
        )
        quiz = QuizCourse.objects.create(
            title="Django Quiz",
            description="Test your Django knowledge",
            instructor=user,
            passing_score=80,
            question_count=10,
        )
        assignment = AssignmentCourse.objects.create(
            title="Build a Blog",
            description="Create a small blog app",
            instructor=user,
            due_date="2026-08-01",
            submission_type="github",
        )

        self.assertEqual(user.role, "instructor")
        self.assertTrue(user.check_password("testpass123"))
        self.assertEqual(course.instructor, user)
        self.assertEqual(lecture.instructor, user)
        self.assertEqual(quiz.instructor, user)
        self.assertEqual(assignment.instructor, user)
        self.assertTrue(isinstance(lecture, LectureCourse))
        self.assertTrue(isinstance(quiz, QuizCourse))
        self.assertTrue(isinstance(assignment, AssignmentCourse))

    def test_instructor_can_create_course_via_api(self):
        user = get_user_model().objects.create_user(
            username="instructor1",
            email="instructor@example.com",
            password="testpass123",
            role="instructor",
        )
        self.client.force_login(user)

        response = self.client.post(
            reverse("courses"),
            {"title": "New Course", "description": "A test course", "instructor": user.id},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["title"], "New Course")
        self.assertEqual(Course.objects.count(), 1)

    def test_student_cannot_create_course_via_api(self):
        user = get_user_model().objects.create_user(
            username="student1",
            email="student@example.com",
            password="testpass123",
            role="student",
        )
        self.client.force_login(user)

        response = self.client.post(
            reverse("courses"),
            {"title": "Blocked Course", "description": "Should not create", "instructor": user.id},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Course.objects.count(), 0)

    def test_student_can_enroll_in_course_via_api(self):
        instructor = get_user_model().objects.create_user(
            username="instructor2",
            email="instructor2@example.com",
            password="testpass123",
            role="instructor",
        )
        course = Course.objects.create(
            title="Advanced Django",
            description="A more advanced course",
            instructor=instructor,
        )
        student = get_user_model().objects.create_user(
            username="student2",
            email="student2@example.com",
            password="testpass123",
            role="student",
        )
        self.client.force_login(student)

        response = self.client.post(
            reverse("course-enroll", kwargs={"pk": course.pk}),
            {},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["course_id"], course.pk)
        self.assertEqual(response.json()["student_id"], student.pk)

    def test_student_can_view_their_enrolled_courses(self):
        instructor = get_user_model().objects.create_user(
            username="instructor3",
            email="instructor3@example.com",
            password="testpass123",
            role="instructor",
        )
        course = Course.objects.create(
            title="Python for Beginners",
            description="An introductory Python course",
            instructor=instructor,
        )
        student = get_user_model().objects.create_user(
            username="student3",
            email="student3@example.com",
            password="testpass123",
            role="student",
        )
        Enrollment.objects.create(student=student, course=course)
        self.client.force_login(student)

        response = self.client.get(reverse("student-enrollments"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]["title"], "Python for Beginners")
