from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, Profile
from .serializers import RegistrationSerializer


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save() 
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Пользователь успешно зарегистрирован',
                'tokens': {
                    'refresh': str(refresh),                                                                                                                
                    'access': str(refresh.access_token),
                },
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserLoginAPI(APIView):
    def post(self, request, format=None):
        login = request.data.get('login')
        password = request.data.get('password')

        user = authenticate(username=login, password=password)

        if user is not None:

            refresh = RefreshToken.for_user(user)
            
            return Response({
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user_id': user.id,
                'username': user.username,
                'nickname': user.nickname
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Неверный логин или пароль"}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        profile, created = Profile.objects.get_or_create(user=user)
        
        avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
        banner_url = request.build_absolute_uri(profile.banner.url) if profile.banner else None
        
        return Response({
            "nickname": user.nickname,
            "profile": {
                "avatar_url": avatar_url,
                "banner_url": banner_url,
                "bio": profile.bio
            }
        })
    
    def put(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)
        
        if 'avatar' in request.FILES:
            profile.avatar = request.FILES['avatar']
        
        if 'banner' in request.FILES:
            profile.banner = request.FILES['banner']
        

        if 'bio' in request.data:
            profile.bio = request.data['bio']
        
        profile.save()
        
        if 'nickname' in request.data:
            user.nickname = request.data['nickname']
            user.save()
        
        avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
        banner_url = request.build_absolute_uri(profile.banner.url) if profile.banner else None
        
        return Response({
            "nickname": user.nickname,
            "profile": {
                "avatar_url": avatar_url,
                "banner_url": banner_url,
                "bio": profile.bio
            }
        })