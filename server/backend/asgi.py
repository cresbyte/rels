import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# For now, use simple ASGI application
# WebSocket support can be added later if needed
application = get_asgi_application()
