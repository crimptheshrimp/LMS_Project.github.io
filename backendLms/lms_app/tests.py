from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import AssignmentCourse, Course, Enrollment, LectureCourse, Notification, QuizCourse, SubjectTag


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

    def test_instructor_can_view_students_and_update_course(self):
        instructor = get_user_model().objects.create_user(
            username="course-owner",
            password="testpass123",
            role="instructor",
        )
        student = get_user_model().objects.create_user(
            username="enrolled-student",
            password="testpass123",
            role="student",
        )
        tag, _ = SubjectTag.objects.get_or_create(name="Science")
        course = Course.objects.create(
            title="Original title",
            description="Original description",
            instructor=instructor,
            estimated_length=2,
        )
        course.tags.add(tag)
        Enrollment.objects.create(student=student, course=course)
        self.client.force_login(instructor)

        managed_response = self.client.get(reverse("managed-courses"))
        self.assertEqual(managed_response.status_code, 200)
        self.assertEqual(managed_response.json()[0]["enrolled_students"][0]["username"], "enrolled-student")

        update_response = self.client.patch(
            reverse("course-detail", kwargs={"pk": course.pk}),
            {"title": "Updated title", "estimated_length": 3.5, "tags": ["Science"]},
            content_type="application/json",
        )
        self.assertEqual(update_response.status_code, 200)
        self.assertTrue(Notification.objects.filter(recipient=student, message__contains="Updated title").exists())
        self.assertTrue(Notification.objects.filter(recipient=student, message__contains="3.5 hours").exists())
        self.assertTrue(Notification.objects.filter(recipient=student, message__contains="Science").exists())

    def test_user_must_verify_current_password_before_changing_password(self):
        user = get_user_model().objects.create_user(
            username="account-owner",
            password="oldpass123",
            role="student",
        )
        self.client.force_login(user)

        rejected_response = self.client.patch(
            reverse("user-account-update", kwargs={"pk": user.pk}),
            {"username": "new-name", "current_password": "wrongpass", "new_password": "newpass123"},
            content_type="application/json",
        )
        self.assertEqual(rejected_response.status_code, 400)
        user.refresh_from_db()
        self.assertEqual(user.username, "account-owner")
        self.assertTrue(user.check_password("oldpass123"))

        accepted_response = self.client.patch(
            reverse("user-account-update", kwargs={"pk": user.pk}),
            {"username": "new-name", "current_password": "oldpass123", "new_password": "newpass123"},
            content_type="application/json",
        )
        self.assertEqual(accepted_response.status_code, 200)
        user.refresh_from_db()
        self.assertEqual(user.username, "new-name")
        self.assertTrue(user.check_password("newpass123"))

    def test_user_cannot_update_another_users_account(self):
        user = get_user_model().objects.create_user(username="first-user", password="testpass123")
        other_user = get_user_model().objects.create_user(username="second-user", password="testpass123")
        self.client.force_login(user)

        response = self.client.patch(
            reverse("user-account-update", kwargs={"pk": other_user.pk}),
            {"username": "not-allowed"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 403)

    def test_admin_can_reset_non_admin_password_but_not_admin_password(self):
        admin = get_user_model().objects.create_user(username="admin-one", password="testpass123", role="admin")
        instructor = get_user_model().objects.create_user(username="teacher-one", password="oldpass123", role="instructor")
        other_admin = get_user_model().objects.create_user(username="admin-two", password="adminpass123", role="admin")
        self.client.force_login(admin)

        reset_response = self.client.patch(
            reverse("user-account-update", kwargs={"pk": instructor.pk}),
            {"new_password": "newpass123"},
            content_type="application/json",
        )
        self.assertEqual(reset_response.status_code, 200)
        instructor.refresh_from_db()
        self.assertTrue(instructor.check_password("newpass123"))

        blocked_response = self.client.patch(
            reverse("user-account-update", kwargs={"pk": other_admin.pk}),
            {"new_password": "notallowed123"},
            content_type="application/json",
        )
        self.assertEqual(blocked_response.status_code, 403)
