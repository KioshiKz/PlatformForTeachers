from django.contrib import admin
from .models import Subject

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'teacher', 'group', 'created_at')
    list_filter = ('group', 'teacher')
    search_fields = ('name',)
