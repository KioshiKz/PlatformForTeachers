from django.contrib import admin
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'teacher', 'group', 'created_at')
    list_filter = ('group',)
    search_fields = ('name', 'teacher__full_name')
    raw_id_fields = ('teacher', 'group')
    ordering = ('name',)
