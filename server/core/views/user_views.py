from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.mail import send_mail
from django.conf import settings
import random
import string
from rest_framework_simplejwt.views import TokenRefreshView
from google.oauth2 import id_token
from google.auth.transport import requests
import json
from django.utils import timezone
import traceback
from datetime import timedelta
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
# Celery removed for simplicity
import logging

from core.serializers.user_ser import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    get_tokens_for_user,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)
from core.models import User
# Celery tasks removed for simplicity

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Welcome email removed for simplicity - will add back later
            
            tokens = get_tokens_for_user(user)
            user_data = UserSerializer(user, context={"request": request}).data
            return Response(
                {"user": user_data, "tokens": tokens}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            tokens = get_tokens_for_user(user)
            user_data = UserSerializer(user, context={"request": request}).data
            return Response(
                {"user": user_data, "tokens": tokens}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser]

    def post(self, request):
        try:
            # Get token from request
            id_token_str = request.data.get("id_token")
            if not id_token_str:
                return Response(
                    {"error": "ID token is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Verify the token
            client_id = settings.GOOGLE_CLIENT_ID
            idinfo = id_token.verify_oauth2_token(
                id_token_str, requests.Request(), client_id
            )

            # Check if token is valid
            if idinfo["iss"] not in [
                "accounts.google.com",
                "https://accounts.google.com",
            ]:
                return Response(
                    {"error": "Invalid token issuer"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get or create user
            email = idinfo["email"]

            try:
                user = User.objects.get(email=email)
                is_new_user = False
            except User.DoesNotExist:
                # Create new user based on Google profile
                user = User.objects.create_user(
                    email=email,
                    first_name=idinfo.get("given_name", ""),
                    last_name=idinfo.get("family_name", ""),
                    password=None,  # Password not needed for OAuth users
                )
                user.set_unusable_password()
                user.save()
                is_new_user = True
                
                # Welcome email removed for simplicity - will add back later

            # Generate tokens
            tokens = get_tokens_for_user(user)
            user_data = UserSerializer(user, context={"request": request}).data

            return Response(
                {"user": user_data, "tokens": tokens}, status=status.HTTP_200_OK
            )

        except ValueError as e:
            # Invalid token
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Other exceptions
            print(traceback.format_exc())
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            # Handle specific fields that need updating
            user = request.user
            if 'first_name' in request.data:
                user.first_name = request.data['first_name']
            if 'last_name' in request.data:
                user.last_name = request.data['last_name']
            # ensure only name fields are updated
            # Save the user with updated fields
            user.save()
            
            # Generate new tokens with updated user data
            tokens = get_tokens_for_user(user)
            
            return Response({
                "user": serializer.data,
                "tokens": tokens
            })
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RequestPasswordResetView(APIView):
    """
    API view for requesting a password reset.
    Sends a 6-digit code to the user's email that expires in 10 minutes.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Check if user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # For security reasons, we'll still return success even if user doesn't exist
                return Response(
                    {"message": "If your email is registered, you will receive a password reset code."},
                    status=status.HTTP_200_OK
                )

            # Generate a 6-digit reset code
            reset_code = ''.join(random.choices(string.digits, k=6))
            
            # Save code to user model with timestamp
            user.password_reset_code = reset_code
            user.password_reset_code_created_at = timezone.now()
            user.save()
            
            # Password reset email removed for simplicity - will add back later
            print(f"Password reset code for {user.email}: {reset_code}")  # For testing
            
            return Response(
                {"message": "If your email is registered, you will receive a password reset code."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """
    API view for resetting a password using the verification code.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            reset_code = serializer.validated_data['reset_code']
            new_password = serializer.validated_data['new_password']
            
            try:
                user = User.objects.get(email=email)
                
                # Check if reset code is valid
                if not user.password_reset_code or user.password_reset_code != reset_code:
                    return Response(
                        {"error": "Invalid reset code"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Check if code is expired (10 minutes)
                if not user.password_reset_code_created_at or \
                   timezone.now() > user.password_reset_code_created_at + timezone.timedelta(minutes=10):
                    return Response(
                        {"error": "Reset code has expired. Please request a new one."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Reset password
                user.set_password(new_password)
                
                # Clear reset code
                user.password_reset_code = None
                user.password_reset_code_created_at = None
                user.save()
                
                # Generate new tokens
                tokens = get_tokens_for_user(user)
                
                # Return success response with tokens
                return Response(
                    {
                        "message": "Password reset successful",
                        "tokens": tokens
                    },
                    status=status.HTTP_200_OK
                )
                
            except User.DoesNotExist:
                return Response(
                    {"error": "No account found with this email"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Celery tasks removed for simplicity
# Will be added back later when needed