from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import CustomTokenObtainPairView, RegisterView, MeView, UserListView, UserDetailView
from groups.views import GroupListCreateView
from subjects.views import SubjectListCreateView


def api_status(request):
    return JsonResponse({
        'status': 'ok',
        'service': 'platformforteachers-backend',
        'api_base': '/api/',
    })


urlpatterns = [
    path('', api_status, name='api_status'),
    path('health/', api_status, name='health'),
    path('admin/', admin.site.urls),

    # Auth endpoints
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/me/', MeView.as_view(), name='me'),

    # Groups (для регистрации)
    path('api/groups/', GroupListCreateView.as_view(), name='group_list_create'),

    # Subjects (для оценок)
    path('api/subjects/', SubjectListCreateView.as_view(), name='subject_list_create'),

    # Users (admin only)
    path('api/users/', UserListView.as_view(), name='user_list'),
    path('api/users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),

    # Students
    path('api/students/', include('students.urls')),

    # Courses
    path('api/courses/', include('courses.urls')),

    # Grades
    path('api/grades/', include('grades.urls')),
]
