from django.contrib import admin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):

    # Fields shown in admin list page
    list_display = (
        'user',
        'age',
        'school',
        'location'
    )

    # Search box in admin
    search_fields = (
        'user__username',
        'school',
        'location'
    )

    # Filters on right side
    list_filter = (
        'school',
        'location'
    )

admin.site.register(Profile, ProfileAdmin)