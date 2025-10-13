from rest_framework import viewsets, permissions
from core.models import Document
from core.serializers.doc_ser import DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show documents belonging to the authenticated user
        return Document.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the document owner
        serializer.save(owner=self.request.user)