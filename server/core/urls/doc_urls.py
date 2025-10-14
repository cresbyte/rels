from django.urls import path
from rest_framework.routers import DefaultRouter
from core.views.doc_views import (
    DocumentViewSet, WidgetViewSet, ContactViewSet, DocumentFieldViewSet
)

router = DefaultRouter()
router.register(r"", DocumentViewSet, basename="documents")
router.register(r"widgets", WidgetViewSet, basename="widgets")
router.register(r"contacts", ContactViewSet, basename="contacts")
router.register(r"document-fields", DocumentFieldViewSet, basename="document-fields")

urlpatterns = router.urls
