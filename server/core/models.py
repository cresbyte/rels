from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
import uuid
from datetime import timedelta
from django.utils import timezone
from django.conf import settings


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )
    password_reset_code = models.CharField(max_length=6, blank=True, null=True)
    password_reset_code_created_at = models.DateTimeField(null=True, blank=True)
    
    # Email verification fields for registration
    email_verification_code = models.CharField(max_length=6, blank=True, null=True)
    email_verification_code_created_at = models.DateTimeField(null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)

    # Required fields for Django admin
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


def user_document_upload_path(instance, filename):
    # Each user's documents are saved under "documents/<user_id>/filename"
    return f"documents/{instance.owner.id}/{filename}"


class Document(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('active', 'Active'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="document", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    scenario = models.CharField(max_length=255, default="self")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    file = models.FileField(upload_to=user_document_upload_path)
    is_public = models.BooleanField(default=False)  # For public forms
    public_token = models.CharField(max_length=255, blank=True, null=True)  # For public form access
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Widget(models.Model):
    """Model to store field definitions and their data types"""
    WIDGET_TYPES = [
        ('text', 'Text Input'),
        ('email', 'Email'),
        ('number', 'Number'),
        ('date', 'Date'),
        ('signature', 'Signature'),
        ('checkbox', 'Checkbox'),
        ('dropdown', 'Dropdown'),
        ('textarea', 'Textarea'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    widget_type = models.CharField(max_length=20, choices=WIDGET_TYPES)
    label = models.CharField(max_length=255)
    placeholder = models.CharField(max_length=255, blank=True, null=True)
    required = models.BooleanField(default=False)
    options = models.JSONField(default=dict, blank=True)  # For dropdown options, validation rules, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.widget_type})"


class Contact(models.Model):
    """Model to store user contacts"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="contacts", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['owner', 'email']  # Prevent duplicate contacts per user

    def __str__(self):
        return f"{self.name} ({self.email})"


class DocumentField(models.Model):
    """Model to store document fields and their assigned contacts"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(
        Document, related_name="fields", on_delete=models.CASCADE
    )
    widget = models.ForeignKey(
        Widget, related_name="document_fields", on_delete=models.CASCADE
    )
    contact = models.ForeignKey(
        Contact, related_name="document_fields", on_delete=models.CASCADE, 
        null=True, blank=True  # Null for public forms
    )
    # Canvas-specific fields
    widget_type = models.CharField(max_length=20, blank=True, null=True)  # Store widget type directly
    label = models.CharField(max_length=255, blank=True, null=True)  # Store label directly
    page_number = models.IntegerField(default=1)
    x_position = models.FloatField(default=0)
    y_position = models.FloatField(default=0)
    width = models.FloatField(default=140)
    height = models.FloatField(default=28)
    recipient_id = models.CharField(max_length=255, blank=True, null=True)  # For multi-signer workflow
    signature_data = models.TextField(blank=True, null=True)  # Store signature image data
    
    field_data = models.JSONField(default=dict, blank=True)  # Store field-specific data like position, size, etc.
    value = models.TextField(blank=True, null=True)  # Store the actual field value
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        contact_name = self.contact.name if self.contact else "Public"
        return f"{self.document.title} - {self.widget.name} ({contact_name})"


def get_default_expiry():
    return timezone.now() + timedelta(days=30)


class DocumentSigningSession(models.Model):
    """Model to track signing sessions for multi-signer workflow"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(
        Document, related_name="signing_sessions", on_delete=models.CASCADE
    )
    contact = models.ForeignKey(
        Contact, related_name="signing_sessions", on_delete=models.CASCADE
    )
    session_token = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    signed_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(default=get_default_expiry)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.document.title} - {self.contact.name} ({self.status})"


class PublicFormSubmission(models.Model):
    """Model to store submissions for public forms"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(
        Document, related_name="public_submissions", on_delete=models.CASCADE
    )
    submitter_name = models.CharField(max_length=255)
    submitter_email = models.EmailField(blank=True, null=True)
    field_data = models.JSONField(default=dict)  # Store all field values
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document.title} - {self.submitter_name} ({self.submitted_at})"
