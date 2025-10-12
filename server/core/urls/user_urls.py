from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from core.views.user_views import (
    RegisterView,
    LoginView,
    UserDetailView,
    GoogleLoginView,
    ForgotPasswordView,
    VerifyResetCodeView,
    ResetPasswordView,
    ChangePasswordView,
    EmailVerificationRequestView,
    EmailVerificationConfirmView,
    CompleteRegistrationView,
)


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("google-login/", GoogleLoginView.as_view(), name="google_login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # verification endpoints removed to align with simplified model
    path("me/", UserDetailView.as_view(), name="user_detail"),
    path(
        "forgot-password/",
        ForgotPasswordView.as_view(),
        name="forgot_password",
    ),
    path(
        "verify-reset-code/",
        VerifyResetCodeView.as_view(),
        name="verify_reset_code",
    ),
    path(
        "reset-password/",
        ResetPasswordView.as_view(),
        name="reset_password",
    ),
    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change_password",
    ),
    # Email verification endpoints for registration
    path(
        "email-verification-request/",
        EmailVerificationRequestView.as_view(),
        name="email_verification_request",
    ),
    path(
        "email-verification-confirm/",
        EmailVerificationConfirmView.as_view(),
        name="email_verification_confirm",
    ),
    path(
        "complete-registration/",
        CompleteRegistrationView.as_view(),
        name="complete_registration",
    ),
]
