from django.db import models


class Group(models.Model):
    """Группа студентов"""
    
    name = models.CharField(max_length=50, verbose_name="Название группы")
    year = models.IntegerField(verbose_name="Курс", default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name}"
    
    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'
        ordering = ['name']
