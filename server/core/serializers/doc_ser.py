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
    fields = serializers.SerializerMethodField(method_name='get_document_fields')
    recipients = serializers.SerializerMethodField()
    public_submissions_count = serializers.SerializerMethodField()
    
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
    
    def get_document_fields(self, obj):
        """Return document fields organized by page"""
        fields = obj.fields.all().order_by('page_number', 'created_at')
        placeholders_by_page = {}
        
        for field in fields:
            page = field.page_number
            if page not in placeholders_by_page:
                placeholders_by_page[page] = []
            
            field_data = {
                "id": str(field.id),
                "key": str(field.id),  # Use ID as key for frontend compatibility
                "type": field.widget_type,
                "label": field.label,
                "xPosition": field.x_position,
                "yPosition": field.y_position,
                "Width": field.width,
                "Height": field.height,
                "scale": field.scale,
                "isStamp": field.is_stamp,
                "signatureType": field.signature_type,
                "recipientId": field.recipient_id,
                "value": field.value,
                "isCompleted": field.is_completed,
                "options": field.options,
                "fieldData": field.field_data,
                "signatureData": field.signature_data,
                "contact": {
                    "id": str(field.contact.id) if field.contact else None,
                    "name": field.contact.name if field.contact else None,
                    "email": field.contact.email if field.contact else None,
                } if field.contact else None
            }
            placeholders_by_page[page].append(field_data)
        
        # Convert to array format expected by frontend
        placeholders = []
        for page_num, fields_list in placeholders_by_page.items():
            placeholders.append({
                "pageNumber": page_num,
                "pos": fields_list
            })
        
        return placeholders
    
    def get_recipients(self, obj):
        """Return recipients (signers) in the format expected by the frontend"""
        recipients = []
        
        # Add document owner as current user recipient
        if obj.owner:
            recipients.append({
                "id": "recipient-current-user",
                "name": f"{obj.owner.first_name or ''} {obj.owner.last_name or ''}".strip() or obj.owner.email,
                "email": obj.owner.email,
                "role": "Signer",
                "fieldsAssigned": [],
                "isCurrentUser": True
            })
        
        # Add signers
        for signer in obj.signers.all():
            recipients.append({
                "id": str(signer.id),
                "name": signer.name,
                "email": signer.email,
                "role": "Signer",
                "fieldsAssigned": [],
                "isCurrentUser": False
            })
        
        return recipients
    
    def get_public_submissions_count(self, obj):
        """Return count of public form submissions"""
        if obj.is_public:
            return obj.public_submissions.count()
        return 0


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
    widget_type_display = serializers.CharField(source="widget.widget_type", read_only=True)
    widget_label = serializers.CharField(source="widget.label", read_only=True)
    contact_name = serializers.CharField(source="contact.name", read_only=True)
    contact_email = serializers.CharField(source="contact.email", read_only=True)

    class Meta:
        model = DocumentField
        fields = [
            "id", "document", "widget", "contact", "widget_type", "label", 
            "page_number", "x_position", "y_position", "width", "height",
            "recipient_id", "signature_data", "field_data", "value", 
            "is_completed", "scale", "is_stamp", "signature_type", "options",
            "widget_name", "widget_type_display", "widget_label",
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


class DocumentFieldBulkCreateSerializer(serializers.Serializer):
    """Serializer for bulk creating document fields from PDF editor"""
    placeholders = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )
    recipients = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )

    def create(self, validated_data):
        document = self.context['document']
        placeholders = validated_data['placeholders']
        recipients = validated_data['recipients']
        
        created_fields = []
        
        # Create fields for each page
        for page_data in placeholders:
            page_number = page_data['pageNumber']
            fields_data = page_data['pos']
            
            for field_data in fields_data:
                # Create or get widget if needed
                widget = None
                if field_data.get('type'):
                    widget, created = Widget.objects.get_or_create(
                        name=field_data.get('options', {}).get('name', f"{field_data['type']}-{page_number}"),
                        defaults={
                            'widget_type': field_data['type'],
                            'label': field_data.get('label', field_data['type'].title()),
                            'placeholder': '',
                            'required': field_data.get('options', {}).get('status') == 'required',
                            'options': field_data.get('options', {})
                        }
                    )
                
                # Get contact based on recipient_id
                contact = None
                recipient_id = field_data.get('recipientId')
                if recipient_id and recipient_id != 'recipient-current-user':
                    # Check if recipient_id is a valid UUID (not a prefixed string)
                    if not recipient_id.startswith('recipient-'):
                        try:
                            contact = Contact.objects.get(id=recipient_id, owner=self.context['request'].user)
                        except (Contact.DoesNotExist, ValueError):
                            # ValueError for invalid UUID format
                            pass
                
                # Create document field
                field_value = field_data.get('value', '') or field_data.get('response', '')
                signature_data = field_data.get('signatureData', '') or field_data.get('signature_data', '')
                
                field = DocumentField.objects.create(
                    document=document,
                    widget=widget,
                    contact=contact,
                    widget_type=field_data.get('type'),
                    label=field_data.get('label'),
                    page_number=page_number,
                    x_position=field_data.get('xPosition', 0),
                    y_position=field_data.get('yPosition', 0),
                    width=field_data.get('Width', 140),
                    height=field_data.get('Height', 28),
                    scale=field_data.get('scale', 1.0),
                    is_stamp=field_data.get('isStamp', False),
                    signature_type=field_data.get('signatureType'),
                    recipient_id=recipient_id,
                    options=field_data.get('options', {}),
                    field_data=field_data.get('fieldData', {}),
                    value=field_value,
                    signature_data=signature_data,
                    is_completed=bool(field_value or signature_data or field_data.get('isCompleted', False))
                )
                created_fields.append(field)
        
        return {'fields': created_fields, 'recipients': recipients}


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
            "id", "document", "submitter_name", "submitter_email", "submitter_phone",
            "field_data", "submitted_at", "document_title"
        ]
        read_only_fields = ["id", "submitted_at"]
