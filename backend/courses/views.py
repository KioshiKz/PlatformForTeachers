from rest_framework import generics, permissions
from .models import Course
from .serializers import CourseSerializer
from accounts.views import IsAdmin, IsTeacher


class CourseListCreateView(generics.ListCreateAPIView):
    """View для списка и создания курсов"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        """Возвращаем все курсы для всех авторизованных пользователей"""
        return Course.objects.all()


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View для управления курсом"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (IsAdmin,)
