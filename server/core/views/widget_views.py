from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.models import Widget
from core.serializers.widget_ser import WidgetSerializer, WidgetCreateSerializer


class WidgetViewSet(viewsets.ModelViewSet):
    serializer_class = WidgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return all widgets (they are reusable across users)
        return Widget.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return WidgetCreateSerializer
        return WidgetSerializer

    @action(detail=False, methods=['get'])
    def types(self, request):
        """Get available widget types"""
        return Response(Widget.WIDGET_TYPES)

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get widgets filtered by type"""
        widget_type = request.query_params.get('type')
        if widget_type:
            widgets = self.get_queryset().filter(widget_type=widget_type)
        else:
            widgets = self.get_queryset()
        
        serializer = self.get_serializer(widgets, many=True)
        return Response(serializer.data)
