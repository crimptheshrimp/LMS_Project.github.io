from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("lms_app", "0004_notification_roleapplication"),
    ]

    operations = [
        migrations.DeleteModel(name="RoleApplication"),
    ]