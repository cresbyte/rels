from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Add your WebSocket URL patterns here
    # Example:
    # re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]

