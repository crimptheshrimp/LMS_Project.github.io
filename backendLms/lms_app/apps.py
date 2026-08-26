from django.apps import AppConfig


class LmsAppConfig(AppConfig):
    name = 'lms_app'

    def ready(self):
        from . import signals
