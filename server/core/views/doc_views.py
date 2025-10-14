from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from core.models import Document, Widget, Contact, DocumentField, DocumentSigningSession, PublicFormSubmission
from core.serializers.doc_ser import (
    DocumentSerializer, WidgetSerializer, ContactSerializer, 
    DocumentFieldSerializer, DocumentFieldCreateSerializer,
    DocumentSigningSessionSerializer, PublicFormSubmissionSerializer
)
import uuid


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

    @action(detail=True, methods=['post'])
    def send_for_signing(self, request, pk=None):
        """Send document for multi-signer workflow"""
        document = self.get_object()
        contacts = request.data.get('contacts', [])
        fields = request.data.get('fields', [])
        
        if not contacts:
            return Response({'error': 'At least one contact is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create signing sessions for each contact
            signing_sessions = []
            for contact_id in contacts:
                contact = Contact.objects.get(id=contact_id, owner=request.user)
                session_token = get_random_string(32)
                
                session = DocumentSigningSession.objects.create(
                    document=document,
                    contact=contact,
                    session_token=session_token,
                    status='pending'
                )
                signing_sessions.append(session)
                
                # Send email to contact
                signing_url = f"{settings.FRONTEND_URL}/sign/{session_token}"
                send_mail(
                    subject=f'Document signing request: {document.title}',
                    message=f'You have been requested to sign a document. Please click the link below to sign:\n\n{signing_url}',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[contact.email],
                    fail_silently=False,
                )
            
            serializer = DocumentSigningSessionSerializer(signing_sessions, many=True)
            return Response({
                'message': 'Document sent for signing successfully',
                'sessions': serializer.data
            })
            
        except Contact.DoesNotExist:
            return Response({'error': 'Invalid contact'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def create_public_form(self, request, pk=None):
        """Create a public form from the document"""
        document = self.get_object()
        
        # Generate a unique public token
        public_token = str(uuid.uuid4())
        document.public_token = public_token
        document.is_public = True
        document.save()
        
        public_url = f"{settings.FRONTEND_URL}/public-form/{public_token}"
        
        return Response({
            'message': 'Public form created successfully',
            'public_url': public_url,
            'public_token': public_token
        })

    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        """Get all submissions for a public form"""
        document = self.get_object()
        if not document.is_public:
            return Response({'error': 'Document is not a public form'}, status=status.HTTP_400_BAD_REQUEST)
        
        submissions = PublicFormSubmission.objects.filter(document=document)
        serializer = PublicFormSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit_public_form(self, request, pk=None):
        """Submit a public form"""
        document = self.get_object()
        if not document.is_public:
            return Response({'error': 'Document is not a public form'}, status=status.HTTP_400_BAD_REQUEST)
        
        field_data = request.data.get('fields', {})
        
        # Create submission
        submission = PublicFormSubmission.objects.create(
            document=document,
            field_data=field_data,
            submitter_email=request.data.get('email', ''),
            submitter_name=request.data.get('name', 'Anonymous')
        )
        
        serializer = PublicFormSubmissionSerializer(submission)
        return Response({
            'message': 'Form submitted successfully',
            'submission': serializer.data
        })


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