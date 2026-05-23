from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Grade
from .serializers import GradeSerializer, GradeReportSerializer
from accounts.views import IsAdmin, IsTeacher, IsStudent
from students.models import Student


class GradeListCreateView(generics.ListCreateAPIView):
    """View для списка и создания оценок"""
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsTeacher()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        """Возвращаем все оценки для всех авторизованных пользователей"""
        return Grade.objects.all().select_related('student__user', 'subject__teacher')


class GradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View для управления оценкой"""
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        """Только преподаватель, который поставил оценку, может её удалить"""
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def delete(self, request, *args, **kwargs):
        """Проверка: удалить оценку может только преподаватель, который её поставил"""
        instance = self.get_object()
        if instance.subject.teacher != request.user:
            return Response(
                {'detail': 'Вы можете удалять только свои оценки'},
                status=status.HTTP_403_FORBIDDEN
            )
        return self.destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Проверка: изменить оценку может только преподаватель, который её поставил"""
        instance = self.get_object()
        if instance.subject.teacher != request.user:
            return Response(
                {'detail': 'Вы можете изменять только свои оценки'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)


class StudentReportView(generics.RetrieveAPIView):
    """View для отчёта успеваемости студента"""
    serializer_class = GradeReportSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        return Grade.objects.none()
    
    def retrieve(self, request, *args, **kwargs):
        student_id = kwargs.get('student_id')
        
        # Проверка прав доступа
        if request.user.role == 'student':
            try:
                student = Student.objects.get(user=request.user)
                if student.id != int(student_id):
                    return Response(
                        {'detail': 'Доступ запрещён'}, 
                        status=403
                    )
            except Student.DoesNotExist:
                return Response(
                    {'detail': 'Студент не найден'}, 
                    status=404
                )
        
        grades = Grade.objects.filter(student_id=student_id).select_related('subject')
        serializer = GradeReportSerializer(grades, many=True)
        
        # Вычисляем средний балл
        if grades.exists():
            average = sum(g.value for g in grades) / len(grades)
            average = round(average, 2)
        else:
            average = 0
        
        # Получаем данные студента
        try:
            student = Student.objects.get(pk=student_id)
            student_name = student.user.full_name or student.user.email
            group_name = student.group.name if student.group else '-'
        except Student.DoesNotExist:
            return Response(
                {'detail': 'Студент не найден'}, 
                status=404
            )
        
        return Response({
            'student_name': student_name,
            'group_name': group_name,
            'average': average,
            'grades': serializer.data
        })
