from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

class Exercise(models.Model):
    """
    Hybrid Exercise Library: Contains global defaults and user-created custom movements.
    """
    name = models.CharField(max_length=255)
    is_global = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    # Flexible tagging for specific categories (e.g., ["Basketball", "Handling", "Cardio"])
    tags = ArrayField(models.CharField(max_length=50), blank=True, default=list)

    def __str__(self):
        return self.name

class MicroCycle(models.Model):
    """
    Dynamic, Auto-Shifting Scheduling.
    Instead of rigidly linking to Monday/Tuesday, we link to an ordered sequence.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100) # e.g., "4-Day Hybrid Split"
    length_in_days = models.IntegerField()
    is_active = models.BooleanField(default=True)
    
    # Tracks where the user is in the cycle. If they miss a day, this just doesn't increment.
    current_day_index = models.IntegerField(default=1) 

class ScheduledDay(models.Model):
    micro_cycle = models.ForeignKey(MicroCycle, related_name='days', on_delete=models.CASCADE)
    day_number = models.IntegerField() # e.g., Day 1, Day 2, Day 3
    focus = models.CharField(max_length=100) # e.g., "Push Heavy", "Court Drills"

class Workout(models.Model):
    """
    The actual instantiated session when the user hits "Start Workout"
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    scheduled_day = models.ForeignKey(ScheduledDay, on_delete=models.SET_NULL, null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

class Set(models.Model):
    """
    The core data point for the "Zero-Typing" Logger and Progression Tracking.
    """
    workout = models.ForeignKey(Workout, related_name='sets', on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    
    set_order = models.IntegerField()
    weight = models.DecimalField(max_digits=6, decimal_places=2, default=0.00) # type: ignore
    reps = models.IntegerField(default=0)
    
    # Intelligent Pacing: Saves the actual time rested AFTER this set
    rest_timer_used = models.IntegerField(help_text="Rest duration in seconds", default=90)
    
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['set_order']