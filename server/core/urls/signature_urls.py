from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views.signature_views import SignatureViewSet

router = DefaultRouter()
router.register(r'', SignatureViewSet, basename='signature')

urlpatterns = router.urls