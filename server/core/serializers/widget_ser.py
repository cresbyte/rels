from rest_framework import serializers
from core.models import Widget


class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = ["id", "name", "widget_type", "label", "placeholder", "required", "options", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class WidgetCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = ["name", "widget_type", "label", "placeholder", "required", "options"]

    def validate_name(self, value):
        """Ensure widget name is unique"""
        if Widget.objects.filter(name=value).exists():
            raise serializers.ValidationError("A widget with this name already exists.")
        return value
