from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from core.models import Document, Widget, Contact, DocumentField
from core.serializers.doc_ser import (
    DocumentSerializer, WidgetSerializer, ContactSerializer, 
    DocumentFieldSerializer, DocumentFieldCreateSerializer
)


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show documents belonging to the authenticated user
        return Document.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the document owner
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get', 'post'])
    def fields(self, request, pk=None):
        """Get or create fields for a specific document"""
        document = self.get_object()
        
        if request.method == 'GET':
            fields = DocumentField.objects.filter(document=document)
            serializer = DocumentFieldSerializer(fields, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            # Create new field
            serializer = DocumentFieldCreateSerializer(
                data=request.data, 
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save(document=document)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_field_value(self, request, pk=None):
        """Update field value for a specific document field"""
        document = self.get_object()
        field_id = request.data.get('field_id')
        value = request.data.get('value')
        
        try:
            field = DocumentField.objects.get(id=field_id, document=document)
            field.value = value
            field.is_completed = bool(value)
            field.save()
            
            serializer = DocumentFieldSerializer(field)
            return Response(serializer.data)
        except DocumentField.DoesNotExist:
            return Response(
                {'error': 'Field not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class WidgetViewSet(viewsets.ModelViewSet):
    serializer_class = WidgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return all widgets (they are reusable across users)
        return Widget.objects.all()

    @action(detail=False, methods=['get'])
    def types(self, request):
        """Get available widget types"""
        return Response(Widget.WIDGET_TYPES)


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show contacts belonging to the authenticated user
        return Contact.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the contact owner
        serializer.save(owner=self.request.user)


class DocumentFieldViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentFieldSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show fields for documents owned by the authenticated user
        return DocumentField.objects.filter(document__owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentFieldCreateSerializer
        return DocumentFieldSerializer

    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        """Mark a field as completed"""
        field = self.get_object()
        field.is_completed = True
        field.save()
        
        serializer = self.get_serializer(field)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_value(self, request, pk=None):
        """Update field value"""
        field = self.get_object()
        value = request.data.get('value')
        
        field.value = value
        field.is_completed = bool(value)
        field.save()
        
        serializer = self.get_serializer(field)
        return Response(serializer.data)