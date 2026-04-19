from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='Регистрация'),
    path('login/', UserLoginAPI.as_view(), name='Вход'),
    path('profile/', ProfileView.as_view(), name='Профиль')
]