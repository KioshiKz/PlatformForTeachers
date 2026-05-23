from rest_framework import serializers
from .models import Grade
from students.serializers import StudentSerializer
from subjects.serializers import SubjectSerializer


class GradeSerializer(serializers.ModelSerializer):
    """Сериализатор оценки"""
    student = StudentSerializer(read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    subject = SubjectSerializer(read_only=True)
    subject_id = serializers.IntegerField(write_only=True)
    teacher_name = serializers.CharField(source='subject.teacher.full_name', read_only=True)
    teacher_email = serializers.CharField(source='subject.teacher.email', read_only=True)

    class Meta:
        model = Grade
        fields = ('id', 'student', 'student_id', 'subject', 'subject_id', 'value', 'comment', 'date', 'created_at', 'teacher_name', 'teacher_email')
        read_only_fields = ('id', 'created_at')


class GradeReportSerializer(serializers.ModelSerializer):
    """Сериализатор оценки для отчёта"""
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='subject.teacher.full_name', read_only=True)

    class Meta:
        model = Grade
        fields = ('id', 'subject_name', 'teacher_name', 'value', 'comment', 'date')
        read_only_fields = fields
