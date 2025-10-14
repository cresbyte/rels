from rest_framework import serializers
from core.models import Contact


class ContactSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.id")

    class Meta:
        model = Contact
        fields = ["id", "owner", "name", "email", "phone", "company", "created_at", "updated_at"]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def validate_email(self, value):
        """Ensure email is unique for the user"""
        user = self.context['request'].user
        if self.instance:
            # For updates, exclude current instance
            if Contact.objects.filter(owner=user, email=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("A contact with this email already exists.")
        else:
            # For creation
            if Contact.objects.filter(owner=user, email=value).exists():
                raise serializers.ValidationError("A contact with this email already exists.")
        return value


class ContactCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ["name", "email", "phone", "company"]

    def create(self, validated_data):
        # Automatically assign the logged-in user as the contact owner
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
