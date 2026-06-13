from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User


from .models import Profile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def login_view(request):

    username = request.data.get('username')

    password = request.data.get('password')

    user = authenticate(
        username = username,
        password = password
    )

    if user: 
        refresh = RefreshToken.for_user(user)

        return  Response({
            'access':str(refresh.access_token),
            'refresh':str(refresh)
        })

    return Response(
        {
            'error':'Invalid Credentials'
        },
        status=400
    )


@api_view(['POST'])
def register_view(request):

    User.objects.create_user(
        username=request.data['username'],
        password=request.data['password']
    )

    return Response({
        'message':'User Created'
    })



@api_view(['POST'])
def logout_view(request):

    try:
        refresh_token = request.data.get("refresh")

        token = RefreshToken(refresh_token)

        token.blacklist()

        return Response({
            'message':'logout successful'
        })
    
    except Exception:

        return Response({
            "error":'Invalid token'
        }, status=400)
    



@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    profile = Profile.objects.get(user=request.user)

    if request.method == 'GET':
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "age": profile.age,
            "school": profile.school,
            "location": profile.location,
            "profile_picture": (
                request.build_absolute_uri(profile.profile_picture.url)
                if profile.profile_picture else None
            )
        })

    data = request.data

    if 'age' in data:
        profile.age = data['age']
    if 'school' in data:
        profile.school = data['school']
    if 'location' in data:
        profile.location = data['location']
    if 'email' in data:
        request.user.email = data['email']
        request.user.save()
    if 'profile_picture' in request.FILES:
        profile.profile_picture = request.FILES['profile_picture']

    profile.save()

    return Response({
        "username": request.user.username,
        "email": request.user.email,
        "age": profile.age,
        "school": profile.school,
        "location": profile.location,
        "profile_picture": (
            request.build_absolute_uri(profile.profile_picture.url)
            if profile.profile_picture else None
        )
    })