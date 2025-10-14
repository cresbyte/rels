#!/usr/bin/env python3
"""
Script to create sample widgets in the database
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append('/home/jon/Desktop/rels/server')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Widget

def create_sample_widgets():
    """Create sample widgets for testing"""
    
    # Clear existing widgets
    Widget.objects.all().delete()
    
    # Create sample widgets
    widgets_data = [
        {
            'name': 'signature_field',
            'widget_type': 'signature',
            'label': 'Signature',
            'placeholder': 'Click to sign',
            'required': True,
            'options': {}
        },
        {
            'name': 'text_field',
            'widget_type': 'text',
            'label': 'Text Input',
            'placeholder': 'Enter text',
            'required': False,
            'options': {}
        },
        {
            'name': 'email_field',
            'widget_type': 'email',
            'label': 'Email',
            'placeholder': 'Enter email address',
            'required': True,
            'options': {}
        },
        {
            'name': 'date_field',
            'widget_type': 'date',
            'label': 'Date',
            'placeholder': 'Select date',
            'required': False,
            'options': {}
        },
        {
            'name': 'number_field',
            'widget_type': 'number',
            'label': 'Number',
            'placeholder': 'Enter number',
            'required': False,
            'options': {}
        },
        {
            'name': 'checkbox_field',
            'widget_type': 'checkbox',
            'label': 'Checkbox',
            'placeholder': '',
            'required': False,
            'options': {}
        },
        {
            'name': 'textarea_field',
            'widget_type': 'textarea',
            'label': 'Text Area',
            'placeholder': 'Enter longer text',
            'required': False,
            'options': {}
        }
    ]
    
    created_widgets = []
    for widget_data in widgets_data:
        widget, created = Widget.objects.get_or_create(
            name=widget_data['name'],
            defaults=widget_data
        )
        created_widgets.append(widget)
        print(f"{'Created' if created else 'Found existing'} widget: {widget.name}")
    
    print(f"\nTotal widgets: {len(created_widgets)}")
    return created_widgets

if __name__ == '__main__':
    create_sample_widgets()
