from django.urls import path
from .views import StudentListCreateView, StudentDetailView

urlpatterns = [
    path('', StudentListCreateView.as_view(), name='student_list_create'),
    path('<int:pk>/', StudentDetailView.as_view(), name='student_detail'),
]
