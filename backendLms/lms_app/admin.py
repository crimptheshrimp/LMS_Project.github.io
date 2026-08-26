from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser, SubjectTag


@admin.register(SubjectTag)
class SubjectTagAdmin(admin.ModelAdmin):
	search_fields = ("name",)


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
	list_display = ("username", "email", "role", "is_staff", "is_active")
	list_filter = ("role", "is_staff", "is_active")
	fieldsets = UserAdmin.fieldsets + (("LMS access", {"fields": ("role", "mobile_number", "interests", "age")}),)
	add_fieldsets = UserAdmin.add_fieldsets + (("LMS access", {"fields": ("role", "mobile_number", "interests", "age")}),)
	filter_horizontal = ()
