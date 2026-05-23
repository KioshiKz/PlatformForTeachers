from django.urls import path
from .views import CourseListCreateView, CourseDetailView

urlpatterns = [
    path('', CourseListCreateView.as_view(), name='course_list_create'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
]
