from django.contrib import admin
from .models import Exercise, MicroCycle, ScheduledDay, Workout, Set

# Register your models here so they appear in the Django admin dashboard
admin.site.register(Exercise)
admin.site.register(MicroCycle)
admin.site.register(ScheduledDay)
admin.site.register(Workout)
admin.site.register(Set)