from django.contrib import admin
from .models import Group


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'year', 'created_at')
    list_filter = ('year',)
    search_fields = ('name',)
    ordering = ('name',)
