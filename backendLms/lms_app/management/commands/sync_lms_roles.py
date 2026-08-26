from django.core.management.base import BaseCommand

from lms_app.models import CustomUser
from lms_app.signals import sync_user_role


class Command(BaseCommand):
    help = "Synchronize every user's LMS role, staff status, and group membership."

    def handle(self, *args, **options):
        for user in CustomUser.objects.all():
            sync_user_role(sender=CustomUser, instance=user)
        self.stdout.write(self.style.SUCCESS("LMS roles synchronized."))
