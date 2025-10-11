from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views.user_views import (
    RegisterView,
    LoginView,
    UserDetailView,
    GoogleLoginView,
    RequestPasswordResetView,
    ResetPasswordView,
)


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("google-login/", GoogleLoginView.as_view(), name="google_login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # verification endpoints removed to align with simplified model
    path("me/", UserDetailView.as_view(), name="user_detail"),
    path(
        "request-password-reset/",
        RequestPasswordResetView.as_view(),
        name="request_password_reset",
    ),
    path(
        "reset-password/",
        ResetPasswordView.as_view(),
        name="reset_password",
    ),
   
]