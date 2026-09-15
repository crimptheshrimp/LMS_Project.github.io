"""
URL configuration for backendLms project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import FileResponse
from django.urls import include, path, re_path
from django.views.static import serve
from pathlib import Path


FRONTEND_ROOT = Path(__file__).resolve().parents[2] / 'build'
FRONTEND_INDEX = FRONTEND_ROOT / 'index.html'


def frontend(request):
    return FileResponse(FRONTEND_INDEX.open('rb'), content_type='text/html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('lms_app.urls')),
    re_path(
        r'^(?P<path>[^/]+\.(?:svg|png|ico|json|txt))$',
        serve,
        {'document_root': FRONTEND_ROOT},
        name='frontend-asset',
    ),
    re_path(r'^(?!api(?:/|$)|admin(?:/|$)|static(?:/|$)).*$', frontend, name='frontend'),
]
