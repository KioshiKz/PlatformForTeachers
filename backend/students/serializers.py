from rest_framework import serializers
from .models import Student
from accounts.serializers import UserSerializer
from groups.serializers import GroupSerializer


class StudentSerializer(serializers.ModelSerializer):
    """Сериализатор студента"""
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    group = GroupSerializer(read_only=True)
    group_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Student
        fields = ('id', 'user', 'user_id', 'student_id_number', 'group', 'group_id', 'created_at')
        read_only_fields = ('id', 'created_at')
