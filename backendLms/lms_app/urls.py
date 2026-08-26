from django.urls import path

from .views import (
    AssignmentCourseListView,
    CourseEnrollView,
    CourseListView,
    CourseDetailView,
    CurrentUserView,
    LectureCourseListView,
    LoginView,
    LogoutView,
    QuizCourseListView,
    RegisterView,
    StudentEnrollmentsView,
    UserProfileView,
    NotificationListView,
    NotificationDetailView,
    UserManagementView,
    UserRoleUpdateView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("auth/user/", CurrentUserView.as_view(), name="current-user"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("notifications/", NotificationListView.as_view(), name="notifications"),
    path("notifications/<int:pk>/", NotificationDetailView.as_view(), name="notification-detail"),
    path("users/", UserManagementView.as_view(), name="user-management"),
    path("users/<int:pk>/role/", UserRoleUpdateView.as_view(), name="user-role-update"),
    path("courses/", CourseListView.as_view(), name="courses"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),
    path("courses/<int:pk>/enroll/", CourseEnrollView.as_view(), name="course-enroll"),
    path("students/enrollments/", StudentEnrollmentsView.as_view(), name="student-enrollments"),
    path("courses/lectures/", LectureCourseListView.as_view(), name="lecture-courses"),
    path("courses/quizzes/", QuizCourseListView.as_view(), name="quiz-courses"),
    path("courses/assignments/", AssignmentCourseListView.as_view(), name="assignment-courses"),
]
