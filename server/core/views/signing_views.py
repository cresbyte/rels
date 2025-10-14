from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from core.models import DocumentSigningSession, PublicFormSubmission, Document, DocumentField
from core.serializers.doc_ser import DocumentSigningSessionSerializer, PublicFormSubmissionSerializer, DocumentSerializer, DocumentFieldSerializer
from django.utils import timezone


class SigningSessionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for signing sessions (read-only for signers)"""
    serializer_class = DocumentSigningSessionSerializer
    permission_classes = [permissions.AllowAny]  # Public access via token
    lookup_field = 'session_token'

    def get_queryset(self):
        return DocumentSigningSession.objects.filter(
            session_token=self.kwargs.get('session_token'),
            expires_at__gt=timezone.now()
        )

    @action(detail=True, methods=['get'])
    def fields(self, request, session_token=None):
        """Get fields assigned to this signing session"""
        session = self.get_object()
        fields = DocumentField.objects.filter(
            document=session.document,
            recipient_id=session.contact.id
        )
        serializer = DocumentFieldSerializer(fields, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def complete(self, request, session_token=None):
        """Mark signing session as completed"""
        session = self.get_object()
        session.status = 'completed'
        session.signed_at = timezone.now()
        session.save()
        
        serializer = self.get_serializer(session)
        return Response(serializer.data)


class PublicFormViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for public forms (read-only for public users)"""
    serializer_class = DocumentSerializer
    permission_classes = [permissions.AllowAny]  # Public access
    lookup_field = 'public_token'

    def get_queryset(self):
        return Document.objects.filter(
            public_token=self.kwargs.get('public_token'),
            is_public=True
        )

    @action(detail=True, methods=['get'])
    def fields(self, request, public_token=None):
        """Get fields for this public form"""
        document = self.get_object()
        fields = DocumentField.objects.filter(document=document)
        serializer = DocumentFieldSerializer(fields, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit(self, request, public_token=None):
        """Submit a public form"""
        document = self.get_object()
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
