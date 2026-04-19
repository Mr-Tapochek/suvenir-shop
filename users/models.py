from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

def validate_cyrillic(value):
    if not all(char in 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ' for char in value):
        raise ValidationError('Only Cyrillic letters are allowed.')

def validate_image_extension(image):
    import os
    ext = os.path.splitext(image.name)[1].lower()
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    if ext not in valid_extensions:
        raise ValidationError(f"Допустимые форматы: {', '.join(valid_extensions)}")        

class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True, help_text="Обязательно, минимум 3 символа")
    nickname = models.CharField(max_length=50, verbose_name='Никнейм')
    first_name = models.CharField(max_length=150, verbose_name='Имя', validators=[validate_cyrillic])
    last_name = models.CharField(max_length=150, verbose_name='Фамилия', validators=[validate_cyrillic])
    patronymic = models.CharField(max_length=150, blank=True, null=True, verbose_name='Отчество', validators=[validate_cyrillic])
    gender = models.CharField(max_length=10, choices=(('male', 'Мужской'), ('female', 'Женский')), default=None, verbose_name='Пол')
    email = models.EmailField(unique=True, verbose_name='Email')
    phone_number = models.CharField(max_length=25, verbose_name='Телефон')
    
    def __str__(self):
        return self.username
    
class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars', null=True, verbose_name='Аватарка', validators=[validate_image_extension])
    banner = models.ImageField(upload_to='banners', null=True, verbose_name='Баннер', validators=[validate_image_extension])
    bio = models.TextField(null=True, verbose_name='О себе') 

    def __str__(self):
        return self.user.username

    class Meta:
        db_table = 'profile'
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'  
        