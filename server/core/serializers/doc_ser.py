from rest_framework import serializers
from core.models import Document, Widget, Contact, DocumentField, DocumentSigningSession, PublicFormSubmission
from django.utils.datastructures import MultiValueDict
import uuid



class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    owner_email = serializers.SerializerMethodField()
    signers = ContactSerializer(many=True, read_only=True)
    bcc_contacts = ContactSerializer(many=True, read_only=True)
    
    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]
    
    def get_owner(self, obj):
        """Return full owner information"""
        if obj.owner:
            return {
                "id": str(obj.owner.id),
                "first_name": obj.owner.first_name,
                "last_name": obj.owner.last_name,
                "email": obj.owner.email,
                "full_name": f"{obj.owner.first_name} {obj.owner.last_name}".strip()
            }
        return None
    
    def get_owner_email(self, obj):
        """Return owner email for compatibility"""
        return obj.owner.email if obj.owner else ""


class DocumentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating documents from Form.jsx"""
    signers = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)
    bcc_contacts = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)
    folder_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Document
        fields = [
            'title', 'description', 'note', 'scenario', 'file',
            'send_in_order', 'automatic_reminders', 'remind_once_in_every',
            'is_tour_enabled', 'time_to_complete_days', 'allow_modifications',
            'is_enable_otp', 'notify_on_signatures', 'request_body', 'request_subject',
            'redirect_url', 'signers', 'bcc_contacts', 'folder_id',"id"
        ]

    def to_internal_value(self, data):
        """
        Override to_internal_value to handle multipart form data with nested arrays like:
        signers[0][email]=...&signers[0][name]=...&signers[1][email]=...
        """
        # Call the parent method to get the initial validated data
        ret = super().to_internal_value(data)

        # Handle signers
        signers_data = self._extract_nested_list(data, 'signers')
        ret['signers'] = signers_data

        # Handle BCC contacts
        bcc_contacts_data = self._extract_nested_list(data, 'bcc_contacts')
        ret['bcc_contacts'] = bcc_contacts_data

        return ret

    def _extract_nested_list(self, data, prefix):
        """
        Extract nested list data from multipart form data.
        e.g., signers[0][email], signers[0][name] -> [{'email': ..., 'name': ...}, ...]
        """
        items = []
        index = 0
        while True:
            email_key = f"{prefix}[{index}][email]"
            name_key = f"{prefix}[{index}][name]"
            phone_key = f"{prefix}[{index}][phone]"  # Add if needed

            # Use .get() to handle missing keys gracefully
            email = data.get(email_key)
            name = data.get(name_key)
            phone = data.get(phone_key)

            # If the email key doesn't exist, we've reached the end of the list
            if email is None:
                break

            # Only add if email exists (to avoid empty objects)
            if email:
                item = {
                    'email': email,
                    'name': name or '',  # Default to empty string if name is missing
                    'phone': phone or '' # Default to empty string if phone is missing
                }
                items.append(item)

            index += 1

        return items

    def create(self, validated_data):
        # Extract related data (now correctly parsed)
        signers_data = validated_data.pop('signers', [])
        bcc_contacts_data = validated_data.pop('bcc_contacts', [])
        folder_id = validated_data.pop('folder_id', None)

        # Set default values based on scenario
        if validated_data.get('scenario') == 'self':
            validated_data['send_in_order'] = False
            validated_data['automatic_reminders'] = False

        # Create document
        document = Document.objects.create(**validated_data)

        # Handle signers
        for signer_data in signers_data:
            email = signer_data.get('email')
            name = signer_data.get('name', '')
            phone = signer_data.get('phone', '')

            if not email:
                continue

            contact, created = Contact.objects.get_or_create(
                email=email,
                owner=validated_data.get('owner'),
                defaults={
                    'name': name,
                    'phone': phone
                }
            )
            document.signers.add(contact)

        # Handle BCC contacts
        for bcc_data in bcc_contacts_data:
            email = bcc_data.get('email')
            name = bcc_data.get('name', '')
            phone = bcc_data.get('phone', '')

            if not email:
                continue

            contact, created = Contact.objects.get_or_create(
                email=email,
                owner=validated_data.get('owner'),
                defaults={
                    'name': name,
                    'phone': phone
                }
            )
            document.bcc_contacts.add(contact)

        # Handle folder
        if folder_id:
            try:
                folder = Document.objects.get(id=folder_id, owner=validated_data.get('owner'))
                document.folder = folder
                document.save()
            except Document.DoesNotExist:
                pass

        return document




class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = ["id", "name", "widget_type", "label", "placeholder", "required", "options", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ContactSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.id")

    class Meta:
        model = Contact
        fields = ["id", "owner", "name", "email", "phone", "company", "created_at", "updated_at"]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]


class DocumentFieldSerializer(serializers.ModelSerializer):
    widget_name = serializers.CharField(source="widget.name", read_only=True)
    widget_type = serializers.CharField(source="widget.widget_type", read_only=True)
    widget_label = serializers.CharField(source="widget.label", read_only=True)
    contact_name = serializers.CharField(source="contact.name", read_only=True)
    contact_email = serializers.CharField(source="contact.email", read_only=True)

    class Meta:
        model = DocumentField
        fields = [
            "id", "document", "widget", "contact", "widget_type", "label", 
            "page_number", "x_position", "y_position", "width", "height",
            "recipient_id", "signature_data", "field_data", "value", 
            "is_completed", "widget_name", "widget_label",
            "contact_name", "contact_email", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class DocumentFieldCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating document fields with nested widget and contact data"""
    widget_data = serializers.JSONField(write_only=True)
    contact_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = DocumentField
        fields = ["document", "widget_data", "contact_id", "field_data", "value"]

    def create(self, validated_data):
        widget_data = validated_data.pop('widget_data')
        contact_id = validated_data.pop('contact_id', None)
        
        # Create or get widget
        widget, created = Widget.objects.get_or_create(
            name=widget_data['name'],
            defaults={
                'widget_type': widget_data['widget_type'],
                'label': widget_data['label'],
                'placeholder': widget_data.get('placeholder', ''),
                'required': widget_data.get('required', False),
                'options': widget_data.get('options', {})
            }
        )
        
        # Get contact if provided
        contact = None
        if contact_id:
            try:
                contact = Contact.objects.get(id=contact_id, owner=self.context['request'].user)
            except Contact.DoesNotExist:
                raise serializers.ValidationError("Contact not found or doesn't belong to user")
        
        validated_data['widget'] = widget
        validated_data['contact'] = contact
        
        return super().create(validated_data)


class DocumentSigningSessionSerializer(serializers.ModelSerializer):
    contact_name = serializers.CharField(source="contact.name", read_only=True)
    contact_email = serializers.CharField(source="contact.email", read_only=True)
    document_title = serializers.CharField(source="document.title", read_only=True)

    class Meta:
        model = DocumentSigningSession
        fields = [
            "id", "document", "contact", "session_token", "status", 
            "signed_at", "expires_at", "contact_name", "contact_email",
            "document_title", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "session_token", "created_at", "updated_at"]


class PublicFormSubmissionSerializer(serializers.ModelSerializer):
    document_title = serializers.CharField(source="document.title", read_only=True)

    class Meta:
        model = PublicFormSubmission
        fields = [
            "id", "document", "submitter_name", "submitter_email", 
            "field_data", "submitted_at", "document_title"
        ]
        read_only_fields = ["id", "submitted_at"]
