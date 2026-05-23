from django.db import models
from django.conf import settings


class Course(models.Model):
    """Учебный курс/предмет"""
    
    name = models.CharField(max_length=200, verbose_name="Название курса")
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'role': 'teacher'},
        related_name='courses',
        verbose_name="Преподаватель"
    )
    group = models.ForeignKey(
        'groups.Group',
        on_delete=models.CASCADE,
        related_name='courses',
        verbose_name="Группа"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.teacher.full_name if self.teacher else 'Б/П'} ({self.group.name})"
    
    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'
        ordering = ['name']
