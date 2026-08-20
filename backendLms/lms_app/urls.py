from django.urls import path

from .views import (
    AssignmentCourseListView,
    CourseEnrollView,
    CourseListView,
    CurrentUserView,
    LectureCourseListView,
    LoginView,
    LogoutView,
    QuizCourseListView,
    RegisterView,
    StudentEnrollmentsView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("auth/user/", CurrentUserView.as_view(), name="current-user"),
    path("courses/", CourseListView.as_view(), name="courses"),
    path("courses/<int:pk>/enroll/", CourseEnrollView.as_view(), name="course-enroll"),
    path("students/enrollments/", StudentEnrollmentsView.as_view(), name="student-enrollments"),
    path("courses/lectures/", LectureCourseListView.as_view(), name="lecture-courses"),
    path("courses/quizzes/", QuizCourseListView.as_view(), name="quiz-courses"),
    path("courses/assignments/", AssignmentCourseListView.as_view(), name="assignment-courses"),
]
