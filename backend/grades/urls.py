from django.urls import path
from .views import GradeListCreateView, GradeDetailView, StudentReportView

urlpatterns = [
    path('', GradeListCreateView.as_view(), name='grade_list_create'),
    path('<int:pk>/', GradeDetailView.as_view(), name='grade_detail'),
    path('reports/student/<int:student_id>/', StudentReportView.as_view(), name='student_report'),
]
