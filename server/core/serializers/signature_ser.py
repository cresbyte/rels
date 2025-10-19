from rest_framework import serializers
from core.models import Signature


class SignatureSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=True)
    
    class Meta:
        model = Signature
        fields = ['id', 'name', 'type', 'image', 'font', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        # The user is already set in the view's perform_create method
        signature = Signature.objects.create(**validated_data)
        return signature