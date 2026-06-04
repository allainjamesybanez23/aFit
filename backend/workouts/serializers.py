from rest_framework import serializers
from .models import Exercise, MicroCycle, ScheduledDay, Workout, Set

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    # This nests the sets inside the workout payload so React gets everything in one request
    sets = SetSerializer(many=True, read_only=True) 
    
    class Meta:
        model = Workout
        fields = '__all__'