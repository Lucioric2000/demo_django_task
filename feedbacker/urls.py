"""demo_django_task URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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
from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

app_name = 'feedbacker'
urlpatterns = [
    path("", views.IndexView.as_view(), name='index'),
    path("features", views.FeaturesView.as_view(), name='features'),
    path("features/add", views.FeatureCreateView.as_view(), name='feature_create'),
    path("features/edit/<int:pk>", views.FeatureEditView.as_view(), name='feature_edit'),
    path("features/delete/<int:pk>", views.FeatureDeleteView.as_view(), name='feature_delete'),
    path("tags", views.TagsView.as_view(), name='tags'),
    path("tags/add", views.TagCreateView.as_view(), name='tag_create'),
    path("tags/edit/<int:pk>", views.TagEditView.as_view(), name='tag_edit'),
    path("tags/delete/<int:pk>", views.TagDeleteView.as_view(), name='tag_delete'),
    path("users", views.UsersView.as_view(), name='users'),
    path("users/add", views.UserCreateView.as_view(), name='user_create'),
    path("users/edit/<int:pk>", views.UserEditView.as_view(), name='user_edit'),
    path("users/delete/<int:pk>", views.UserDeleteView.as_view(), name='user_delete'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
