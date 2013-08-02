from django.db import models
from django.contrib.auth.models import User

class Ride(models.Model):
    name           = models.CharField(max_length = '255')
    slug           = models.CharField(max_length = '255', unique = True)
    description    = models.TextField()
    start_location = models.CharField(max_length = '255')
    end_location   = models.CharField(max_length = '255')
    start_date     = models.DateTimeField()
    end_date       = models.DateTimeField()
    rider_capacity = models.IntegerField(default = 0)

    # Linked Entities
    chapter        = models.ForeignKey('chapters.Chapter')
    riders         = models.ManyToManyField(User)

    class Meta:
        db_table    = 'rides'
        app_label   = 'rides'