from django.db import models
from django.contrib.auth.models import User

class Ride(models.Model):
    name           = models.CharField(max_length = '255')
    slug           = models.CharField(max_length = '255', unique = True)
    description    = models.TextField(blank = True)
    start_location = models.CharField(max_length = '255')
    end_location   = models.CharField(max_length = '255')
    start_date     = models.DateField()
    end_date       = models.DateField()

    # Details to sign up riders
    rider_capacity = models.IntegerField(default = 0)
    price          = models.IntegerField(default = 0)

    # Linked Entities
    chapter        = models.ForeignKey('chapters.Chapter', null=True, blank=True)
    riders         = models.ManyToManyField(User, null=True, blank=True)

    class Meta:
        db_table    = 'rides'
        app_label   = 'rides'