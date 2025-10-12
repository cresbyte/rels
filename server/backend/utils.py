from django.conf import settings
from django.template.defaultfilters import register


def get_absolute_media_url(relative_url):
    """
    Convert a relative media URL to an absolute URL with domain

    Args:
        relative_url: The relative URL (e.g., '/media/images/image.jpg')

    Returns:
        str: Absolute URL with domain (e.g., 'http://example.com/media/images/image.jpg')
    """
    if not relative_url:
        return None

    # If it's already an absolute URL (starts with http), return it as is
    if relative_url.startswith(("http://", "https://")):
        return relative_url

    # Remove leading slash if present to avoid double slashes
    if relative_url.startswith("/"):
        relative_url = relative_url[1:]

    # Get base URL from settings
    base_url = getattr(settings, "BASE_URL", "http://localhost:8000")

    # Make sure base_url doesn't end with slash
    if base_url.endswith("/"):
        base_url = base_url[:-1]

    return f"{base_url}/{relative_url}"


@register.filter
def length_is(value, arg):
    """
    Custom replacement for the removed length_is filter
    Returns True if the value's length is the argument, False otherwise.
    """
    try:
        return len(value) == int(arg)
    except (ValueError, TypeError):
        return False
