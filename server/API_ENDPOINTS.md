# API Endpoints Documentation

## Overview
This document describes the new API endpoints for the document signing system with widgets, contacts, and document fields.

## Models Created

### 1. Widget Model
Stores field definitions and their data types:
- `id`: UUID primary key
- `name`: Widget name
- `widget_type`: Type of widget (text, email, number, date, signature, checkbox, dropdown, textarea)
- `label`: Display label
- `placeholder`: Placeholder text
- `required`: Whether field is required
- `options`: JSON field for additional options (dropdown choices, validation rules, etc.)

### 2. Contact Model
Stores user contacts:
- `id`: UUID primary key
- `owner`: Foreign key to User
- `name`: Contact name
- `email`: Contact email
- `phone`: Contact phone (optional)
- `company`: Contact company (optional)

### 3. DocumentField Model
Links documents with widgets and contacts:
- `id`: UUID primary key
- `document`: Foreign key to Document
- `widget`: Foreign key to Widget
- `contact`: Foreign key to Contact (nullable for public forms)
- `field_data`: JSON field for field-specific data (position, size, etc.)
- `value`: The actual field value
- `is_completed`: Whether the field is completed

## API Endpoints

### Documents
- `GET /api/documents/` - List user's documents
- `POST /api/documents/` - Create new document
- `GET /api/documents/{id}/` - Get specific document
- `PUT /api/documents/{id}/` - Update document
- `DELETE /api/documents/{id}/` - Delete document
- `GET /api/documents/{id}/fields/` - Get document fields
- `POST /api/documents/{id}/fields/` - Create document field
- `PATCH /api/documents/{id}/update_field_value/` - Update field value

### Widgets
- `GET /api/widgets/` - List all widgets
- `POST /api/widgets/` - Create new widget
- `GET /api/widgets/{id}/` - Get specific widget
- `PUT /api/widgets/{id}/` - Update widget
- `DELETE /api/widgets/{id}/` - Delete widget
- `GET /api/widgets/types/` - Get available widget types

### Contacts
- `GET /api/contacts/` - List user's contacts
- `POST /api/contacts/` - Create new contact
- `GET /api/contacts/{id}/` - Get specific contact
- `PUT /api/contacts/{id}/` - Update contact
- `DELETE /api/contacts/{id}/` - Delete contact

### Document Fields
- `GET /api/document-fields/` - List user's document fields
- `POST /api/document-fields/` - Create new document field
- `GET /api/document-fields/{id}/` - Get specific document field
- `PUT /api/document-fields/{id}/` - Update document field
- `DELETE /api/document-fields/{id}/` - Delete document field
- `PATCH /api/document-fields/{id}/complete/` - Mark field as completed
- `PATCH /api/document-fields/{id}/update_value/` - Update field value

## Example Usage

### Creating a Document with Fields

1. **Create a document:**
```json
POST /api/documents/
{
    "title": "Contract Agreement",
    "scenario": "multi",
    "is_public": false
}
```

2. **Add fields to the document:**
```json
POST /api/documents/{document_id}/fields/
{
    "widget_data": {
        "name": "signature_field_1",
        "widget_type": "signature",
        "label": "Signature",
        "required": true,
        "options": {}
    },
    "contact_id": "contact-uuid-here",
    "field_data": {
        "x": 100,
        "y": 200,
        "width": 200,
        "height": 50
    }
}
```

### Creating Contacts

```json
POST /api/contacts/
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Example Corp"
}
```

### Public Forms

For public forms, set `is_public: true` on the document and don't specify a `contact_id` when creating fields:

```json
POST /api/documents/
{
    "title": "Public Survey",
    "scenario": "public",
    "is_public": true
}
```

```json
POST /api/documents/{document_id}/fields/
{
    "widget_data": {
        "name": "feedback_field",
        "widget_type": "textarea",
        "label": "Your Feedback",
        "required": true
    },
    "contact_id": null,
    "field_data": {
        "x": 50,
        "y": 100,
        "width": 400,
        "height": 100
    }
}
```

## Widget Types Available

- `text`: Text Input
- `email`: Email Input
- `number`: Number Input
- `date`: Date Input
- `signature`: Signature Field
- `checkbox`: Checkbox
- `dropdown`: Dropdown Selection
- `textarea`: Multi-line Text Input

## Security Features

- All endpoints require authentication
- Users can only access their own documents, contacts, and document fields
- Widgets are shared across users (reusable components)
- Public forms allow anonymous access to specific fields
- Contact validation ensures contacts belong to the requesting user
