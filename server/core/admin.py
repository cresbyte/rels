from django.contrib import admin
from core.models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Document)
admin.site.register(Contact)
admin.site.register(Signature)
admin.site.register(DocumentField)


admin.site.site_header = "RelaySign Admin"
admin.site.site_title = "RelaySign Admin Portal"
