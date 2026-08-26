from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("lms_app", "0002_enrollment"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="mobile_number",
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name="customuser",
            name="interests",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="customuser",
            name="age",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]