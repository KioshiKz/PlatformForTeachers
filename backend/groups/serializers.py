from rest_framework import serializers
from .models import Group


class GroupSerializer(serializers.ModelSerializer):
    """Сериализатор группы"""
    
    class Meta:
        model = Group
        fields = ('id', 'name', 'year', 'created_at')
        read_only_fields = ('id', 'created_at')
