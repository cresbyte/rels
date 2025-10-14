from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.models import Contact
from core.serializers.contact_ser import ContactSerializer, ContactCreateSerializer


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show contacts belonging to the authenticated user
        return Contact.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return ContactCreateSerializer
        return ContactSerializer

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the contact owner
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search contacts by name or email"""
        query = request.query_params.get('q', '')
        if query:
            contacts = self.get_queryset().filter(
                name__icontains=query
            ) | self.get_queryset().filter(
                email__icontains=query
            )
        else:
            contacts = self.get_queryset()
        
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)
