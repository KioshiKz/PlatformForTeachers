from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'student_id_number', 'group', 'created_at')
    list_filter = ('group',)
    search_fields = ('user__full_name', 'user__email', 'student_id_number')
    raw_id_fields = ('user', 'group')
    ordering = ('user__full_name',)
