from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор пользователя"""

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'role', 'is_active', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class UserCreateSerializer(serializers.ModelSerializer):
    """Сериализатор регистрации пользователя"""
    password = serializers.CharField(write_only=True, min_length=6)
    # Дополнительные поля для студентов
    group_id = serializers.IntegerField(write_only=True, required=False)
    # Дополнительные поля для преподавателей
    teacher_group_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    teacher_group_year = serializers.IntegerField(write_only=True, required=False, min_value=1, max_value=6)
    teacher_course_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'password', 'role', 'group_id', 'teacher_group_name', 'teacher_group_year', 'teacher_course_name')

    def create(self, validated_data):
        password = validated_data.pop('password')
        group_id = validated_data.pop('group_id', None)
        teacher_group_name = validated_data.pop('teacher_group_name', None)
        teacher_group_year = validated_data.pop('teacher_group_year', None)
        teacher_course_name = validated_data.pop('teacher_course_name', None)
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        # Если пользователь студент и указана группа, создаем профиль
        if user.role == 'student' and group_id:
            from students.models import Student
            from django.utils.crypto import get_random_string
            Student.objects.create(
                user=user,
                student_id_number=get_random_string(8, '0123456789'),
                group_id=group_id
            )
        
        # Если пользователь преподаватель и указана группа, создаем её и предмет
        if user.role == 'teacher' and teacher_group_name:
            from groups.models import Group
            from subjects.models import Subject
            
            # Создаем или получаем группу
            group, created = Group.objects.get_or_create(
                name=teacher_group_name,
                defaults={'year': teacher_group_year or 1}
            )
            
            # Создаем предмет для преподавателя
            subject_name = teacher_course_name if teacher_course_name else f"{teacher_group_name} - Основной предмет"
            Subject.objects.create(
                name=subject_name,
                teacher=user,
                group=group
            )
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Кастомный сериализатор токена с email вместо username"""
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            from django.contrib.auth import authenticate
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            
            if not user:
                raise serializers.ValidationError('Неверный email или пароль')
            
            if not user.is_active:
                raise serializers.ValidationError('Пользователь не активен')
            
            attrs['username'] = user.email
        else:
            raise serializers.ValidationError('Email и пароль обязательны')
        
        return super().validate(attrs)
