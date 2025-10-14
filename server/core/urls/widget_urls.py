from django.urls import path
from rest_framework.routers import DefaultRouter
from core.views.widget_views import WidgetViewSet

router = DefaultRouter()
router.register(r"", WidgetViewSet, basename="widgets")

urlpatterns = router.urls
