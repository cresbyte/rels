from rest_framework import serializers
from core.models import Document, Widget, Contact, DocumentField


class DocumentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(
        source="owner.id"
    )  # Prevent users from setting owner manually

    class Meta:
        model = Document
        fields = ["id", "owner", "title", "scenario", "status", "file", "is_public", "created_at", "updated_at"]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]


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
            "id", "document", "widget", "contact", "field_data", "value", 
            "is_completed", "widget_name", "widget_type", "widget_label",
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
