from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser

from core.models import Signature
from core.serializers.signature_ser import SignatureSerializer


class SignatureViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user signatures.
    """
    serializer_class = SignatureSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        """
        Return signatures for the current authenticated user only.
        """
        print("User in SignatureViewSet:", self.request.user)
        return Signature.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Create a new signature for the current user.
        """
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """
        Return a list of signatures for the current user.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'count': queryset.count()
        })

    def destroy(self, request, *args, **kwargs):
        """
        Delete a signature and its associated image file, then return a success message.
        """
        instance = self.get_object()
        
        # Delete the image file if it exists
        if instance.image:
            try:
                instance.image.delete(save=False)
            except Exception as e:
                print(f"Error deleting signature image: {e}")
        
        self.perform_destroy(instance)
        return Response({"message": "Signature deleted successfully"}, status=status.HTTP_200_OK)