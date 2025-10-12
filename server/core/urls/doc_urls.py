from django.urls import path
from rest_framework.routers import DefaultRouter
from core.views.doc_views import DocumentViewSet

router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="documents")

urlpatterns = [
    path("", DocumentViewSet.as_view({'get': 'list', 'post': 'create'}), name="document-list"),
] + router.urls
