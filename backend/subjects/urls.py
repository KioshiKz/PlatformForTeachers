from django.urls import path
from .views import SubjectListCreateView, SubjectDetailView

urlpatterns = [
    path('', SubjectListCreateView.as_view(), name='subject_list_create'),
    path('<int:pk>/', SubjectDetailView.as_view(), name='subject_detail'),
]
