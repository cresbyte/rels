from django.urls import path
from rest_framework.routers import DefaultRouter
from core.views.contact_views import ContactViewSet

router = DefaultRouter()
router.register(r"", ContactViewSet, basename="contacts")

urlpatterns = router.urls
