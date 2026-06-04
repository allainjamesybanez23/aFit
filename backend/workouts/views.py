from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Exercise, Workout, Set
from .serializers import ExerciseSerializer, WorkoutSerializer, SetSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    # The crucial endpoint for our "Zero-Typing" Logger
    @action(detail=True, methods=['get'])
    def last_performance(self, request, pk=None):
        # MVP Constraint: Hardcoding user ID 1 for now since this is a personal app. 
        # We will swap this to `request.user` if you add full authentication later.
        user_id = 1 
        
        # Highly efficient query to get exactly the last logged set for this exercise
        last_set = Set.objects.filter(
            exercise_id=pk, 
            workout__user_id=user_id
        ).select_related('workout').order_by('-completed_at').first()

        if last_set:
            return Response({
                "weight": last_set.weight,
                "reps": last_set.reps,
                "rest_timer_used": last_set.rest_timer_used
            })
        
        # Default fallback if you have never done this exercise before
        return Response({
            "weight": 0.00,
            "reps": 0,
            "rest_timer_used": 90
        })

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.all()
    serializer_class = SetSerializer