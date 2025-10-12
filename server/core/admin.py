from django.contrib import admin
from core.models import User, Document

# Register your models here.
admin.site.register(User)
admin.site.register(Document)

admin.site.site_header = "RelaySign Admin"
admin.site.site_title = "RelaySign Admin Portal"
