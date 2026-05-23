from django.db import models
from django.conf import settings


class Student(models.Model):
    """Профиль студента"""
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile',
        verbose_name="Пользователь"
    )
    student_id_number = models.CharField(max_length=20, verbose_name="Номер билета")
    group = models.ForeignKey(
        'groups.Group',
        on_delete=models.SET_NULL,
        null=True,
        related_name='students',
        verbose_name="Группа"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.full_name or self.user.email} ({self.student_id_number})"
    
    class Meta:
        verbose_name = 'Студент'
        verbose_name_plural = 'Студенты'
        ordering = ['user__full_name']
