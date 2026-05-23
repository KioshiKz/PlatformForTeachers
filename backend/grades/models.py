from django.db import models
from django.utils import timezone


class Grade(models.Model):
    """Оценка студента"""

    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='grades',
        verbose_name="Студент"
    )
    subject = models.ForeignKey(
        'subjects.Subject',
        on_delete=models.CASCADE,
        related_name='grades',
        verbose_name="Предмет"
    )
    value = models.IntegerField(verbose_name="Оценка", default=5)
    comment = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    date = models.DateField(default=timezone.now, verbose_name="Дата")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.user.full_name}: {self.value} ({self.subject.name})"

    class Meta:
        verbose_name = 'Оценка'
        verbose_name_plural = 'Оценки'
        ordering = ['-date']
