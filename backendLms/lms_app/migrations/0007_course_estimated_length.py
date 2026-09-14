from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("lms_app", "0006_subjecttag_course_tags"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="estimated_length",
            field=models.DecimalField(decimal_places=1, default=0, max_digits=6),
        ),
    ]