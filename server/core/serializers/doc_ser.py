from rest_framework import serializers
from core.models import Document


class DocumentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(
        source="owner.id"
    )  # Prevent users from setting owner manually

    class Meta:
        model = Document
        fields = ["id", "owner", "title", "file", "created_at", "updated_at"]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]
