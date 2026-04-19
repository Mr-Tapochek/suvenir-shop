from rest_framework import serializers
from .models import CustomUser, Profile

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'nickname', 'first_name', 'last_name', 
                  'patronymic', 'gender', 'email', 'phone_number', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            nickname=validated_data['nickname'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            patronymic=validated_data.get('patronymic'),
            gender=validated_data.get('gender'),
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password']
        )

        Profile.objects.create(user=user)

        return user
   