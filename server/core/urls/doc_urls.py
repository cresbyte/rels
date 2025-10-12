from rest_framework.routers import DefaultRouter
from core.views.doc_views import DocumentViewSet

router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="documents")

urlpatterns = router.urls
