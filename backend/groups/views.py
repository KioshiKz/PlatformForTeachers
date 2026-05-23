from rest_framework import generics, permissions
from .models import Group
from .serializers import GroupSerializer
from accounts.views import IsAdmin


class GroupListCreateView(generics.ListCreateAPIView):
    """View для списка и создания групп"""
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [permissions.AllowAny()]


class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View для управления группой"""
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (IsAdmin,)
