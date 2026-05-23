from rest_framework import generics, permissions
from .models import Subject
from .serializers import SubjectSerializer
from accounts.views import IsAdmin


class SubjectListCreateView(generics.ListCreateAPIView):
    """View для списка и создания предметов"""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        """Все авторизованные пользователи видят все предметы"""
        return Subject.objects.all().select_related('teacher', 'group')


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View для управления предметом"""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = (IsAdmin,)
