from rest_framework import serializers
from .models import Subject
from accounts.serializers import UserSerializer
from groups.serializers import GroupSerializer


class SubjectSerializer(serializers.ModelSerializer):
    """Сериализатор предмета"""
    teacher = UserSerializer(read_only=True)
    teacher_id = serializers.IntegerField(write_only=True)
    group = GroupSerializer(read_only=True)
    group_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Subject
        fields = ('id', 'name', 'teacher', 'teacher_id', 'group', 'group_id', 'created_at')
        read_only_fields = ('id', 'created_at')
