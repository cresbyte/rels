from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, parser_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from core.models import Document, Widget, Contact, DocumentField, DocumentSigningSession, PublicFormSubmission
from core.serializers.doc_ser import (
    DocumentSerializer, DocumentCreateSerializer, WidgetSerializer, ContactSerializer, 
    DocumentFieldSerializer, DocumentFieldCreateSerializer,
    DocumentSigningSessionSerializer, PublicFormSubmissionSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser
from pypdf import PdfReader, PdfWriter
import uuid
import os
from django.core.files.storage import default_storage
from django.http import FileResponse
from rest_framework.decorators import api_view, parser_classes
from django.core.exceptions import ValidationError
import io

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show documents belonging to the authenticated user
        queryset = Document.objects.filter(owner=self.request.user)
        
        # Apply filters from query parameters
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(title__icontains=search)
        
        # Filter for documents needing signature (for "Need your sign" report)
        needs_signature = self.request.query_params.get('needs_signature')
        user_id = self.request.query_params.get('user_id')
        if needs_signature == 'true' and user_id:
            # Get documents where user is a signer but hasn't completed signing
            queryset = queryset.filter(
                signers__id=user_id
            ).exclude(
                signing_sessions__contact__id=user_id,
                signing_sessions__status='completed'
            ).exclude(
                status='completed'  # Don't show already completed documents
            )
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentCreateSerializer
        return DocumentSerializer

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the document owner
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a document and its associated file, then return a success message.
        """
        instance = self.get_object()
        
        # Delete the file if it exists
        if instance.file:
            try:
                instance.file.delete(save=False)
            except Exception as e:
                print(f"Error deleting document file: {e}")
        
        self.perform_destroy(instance)
        return Response({"message": "Document deleted successfully"}, status=status.HTTP_200_OK)

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



@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def decryptpdf(request):
    """
    Decrypt a password-protected PDF file.
    Returns the decrypted PDF as a downloadable file.
    """
    try:
        uploaded_file = request.FILES.get('file')
        password = request.data.get('password', '')
        
        if not uploaded_file:
            return Response(
                {'error': 'No file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Read the PDF
        pdf_reader = PdfReader(uploaded_file)
        
        if pdf_reader.is_encrypted:
            if not pdf_reader.decrypt(password):
                return Response(
                    {'error': 'Incorrect password'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        # Write decrypted PDF to buffer
        output_buffer = io.BytesIO()
        pdf_writer = PdfWriter()
        for page in pdf_reader.pages:
            pdf_writer.add_page(page)
        pdf_writer.write(output_buffer)
        output_buffer.seek(0)  # Important: rewind buffer to start

        # Return as FileResponse — this handles binary correctly
        return FileResponse(
            output_buffer,
            content_type='application/pdf',
            as_attachment=False,  # or True if you want "download"
            filename='decrypted.pdf'
        )

    except Exception as e:
        print('Error in decrypt file:', str(e))
        error_message = 'Something went wrong during decryption.'
        if 'password' in str(e).lower() or 'decrypt' in str(e).lower():
            return Response({'error': 'Incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    """
    Upload a file and return a secure URL for the uploaded file.
    """
    try:
        uploaded_file = request.FILES.get('file')
        
        if not uploaded_file:
            return Response(
                {'error': 'No file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate a unique filename
        file_extension = os.path.splitext(uploaded_file.name)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Save the file to storage
        file_path = default_storage.save(f"uploads/{unique_filename}", uploaded_file)
        
        # Generate the file URL
        file_url = default_storage.url(file_path)
        
        return Response({
            'message': 'File uploaded successfully',
            'url': file_url,
            'filename': unique_filename
        })
        
    except Exception as e:
        print('Error in upload file:', str(e))
        return Response(
            {'error': 'Something went wrong during file upload'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

