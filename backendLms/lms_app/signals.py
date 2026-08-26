from django.contrib.auth.models import Group
from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver

from .models import CustomUser

GROUP_NAMES = {
    "student": "LMS Student",
    "instructor": "LMS Teacher",
    "admin": "LMS Admin",
}


@receiver(post_save, sender=CustomUser)
def sync_user_role(sender, instance, **kwargs):
    role = "admin" if instance.is_superuser else instance.role
    if instance.role != role or (role == "admin" and not instance.is_staff):
        sender.objects.filter(pk=instance.pk).update(role=role, is_staff=role == "admin")
        instance.role = role
        instance.is_staff = role == "admin"

    group = Group.objects.filter(name=GROUP_NAMES[role]).first()
    if group:
        instance.groups.set([group])


@receiver(post_migrate)
def configure_lms_groups(sender, **kwargs):
    if sender.name != "lms_app":
        return

    from django.contrib.auth.models import Permission
    from django.contrib.contenttypes.models import ContentType

    model_permissions = {
        "LMS Admin": {
            "customuser": {"add", "change", "delete", "view"},
            "course": {"add", "change", "delete", "view"},
            "enrollment": {"add", "change", "delete", "view"},
            "notification": {"add", "change", "delete", "view"},
        },
        "LMS Teacher": {
            "course": {"add", "change", "delete", "view"},
            "enrollment": {"view"},
            "notification": {"add", "change", "delete", "view"},
        },
        "LMS Student": {
            "course": {"view"},
            "enrollment": {"add", "view"},
            "notification": {"view"},
        },
    }

    for group_name, models in model_permissions.items():
        group, _ = Group.objects.get_or_create(name=group_name)
        permissions = []
        for model_name, actions in models.items():
            content_type = ContentType.objects.get(app_label="lms_app", model=model_name)
            permissions.extend(
                Permission.objects.filter(content_type=content_type, codename__in={f"{action}_{model_name}" for action in actions})
            )
        group.permissions.set(permissions)