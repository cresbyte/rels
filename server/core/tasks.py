import logging
from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import User

logger = logging.getLogger(__name__)



@shared_task
def send_welcome_email(user_id):
    """
    Send welcome email to newly registered users
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Get frontend URL from settings
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        
        # Prepare email
        context = {
            'user': user,
            'frontend_url': frontend_url,
        }
        
        # Render HTML content
        html_content = render_to_string('accounts/email/welcome_email.html', context)
        text_content = strip_tags(html_content)
        
        subject = f"Welcome to MbokaLink, {user.first_name}!"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = user.email
        
        # Create and send email
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        
        logger.info(f"Welcome email sent to {user.email}")
        return True
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} not found")
        return False
    except Exception as e:
        logger.error(f"Error sending welcome email: {str(e)}")
        return False


@shared_task
def send_password_reset_email(user_id, reset_code):
    """
    Send password reset email with code to the user
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Prepare email
        context = {
            'user': user,
            'reset_code': reset_code,
        }
        
        # Render HTML content
        html_content = render_to_string('accounts/email/password_reset.html', context)
        text_content = strip_tags(html_content)
        
        subject = "MbokaLink - Reset Your Password"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = user.email
        
        # Create and send email
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        
        logger.info(f"Password reset email sent to {user.email}")
        return True
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} not found")
        return False
    except Exception as e:
        logger.error(f"Error sending password reset email: {str(e)}")
        return False 