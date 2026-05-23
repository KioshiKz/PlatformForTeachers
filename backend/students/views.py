from rest_framework import generics, permissions
from .models import Student
from .serializers import StudentSerializer
from accounts.views import IsAdmin


class StudentListCreateView(generics.ListCreateAPIView):
    """View для списка и создания студентов"""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View для управления студентом"""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]
