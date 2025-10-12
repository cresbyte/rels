from rest_framework import serializers
from core.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from backend.utils import get_absolute_media_url


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    # Add custom claims - include all relevant user information
    refresh["user_id"] = str(user.id)
    refresh["email"] = user.email
    refresh["first_name"] = user.first_name
    refresh["last_name"] = user.last_name

    # Make sure the profile picture URL is included with absolute URL
    if user.profile_picture and hasattr(user.profile_picture, "url"):
        # Use the utility function to ensure an absolute URL
        refresh["profile_picture_url"] = get_absolute_media_url(
            user.profile_picture.url
        )
    else:
        refresh["profile_picture_url"] = ""

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "password", "password_confirm"]

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if email and password:
            user = authenticate(email=email, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is disabled.")
                data["user"] = user
                return data
            raise serializers.ValidationError(
                "Unable to log in with provided credentials."
            )
        raise serializers.ValidationError("Must include 'email' and 'password'.")


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "profile_picture",
            "profile_picture_url",
            "date_joined",
        ]
        read_only_fields = ["id"]

    def get_full_name(self, obj):
        return obj.full_name

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset code
    """
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for confirming a password reset
    """
    email = serializers.EmailField(required=True)
    reset_code = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        """
        Validate that the two password fields match and that the password meets requirements
        """
        # Check that passwords match
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing password when user is authenticated
    """
    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, min_length=8, write_only=True)

    def validate_current_password(self, value):
        """
        Validate that the current password is correct
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value
