from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExerciseViewSet, WorkoutViewSet, SetViewSet

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'workouts', WorkoutViewSet)
router.register(r'sets', SetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]