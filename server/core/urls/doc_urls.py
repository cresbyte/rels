from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views.doc_views import (
    DocumentViewSet, WidgetViewSet, ContactViewSet, DocumentFieldViewSet, decryptpdf, upload_file
)
from core.views.signing_views import SigningSessionViewSet, PublicFormViewSet

router = DefaultRouter()
router.register(r"", DocumentViewSet, basename="documents")
router.register(r"widgets", WidgetViewSet, basename="widgets")
router.register(r"contacts", ContactViewSet, basename="contacts")
router.register(r"document-fields", DocumentFieldViewSet, basename="document-fields")
router.register(r"signing-sessions", SigningSessionViewSet, basename="signing-sessions")
router.register(r"public-forms", PublicFormViewSet, basename="public-forms")

urlpatterns = [
    path('decryptpdf/', decryptpdf, name='decryptpdf'),
    path('upload/', upload_file, name='upload-file'),
] + router.urls