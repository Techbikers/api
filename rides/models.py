from django.db import models
from django.contrib.auth.models import User

from sales.models import Sale

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
    riders         = models.ManyToManyField(User, through='RideRiders', null=True, blank=True)

    class Meta:
        db_table    = 'rides'
        app_label   = 'rides'


class RideRiders(models.Model):
    user = models.ForeignKey(User)
    ride = models.ForeignKey(Ride)

    # Other information we might want to know about a user signing up to a ride
    signup_date = models.DateTimeField()
    pending     = models.BooleanField() # is the spot reserved for them before paying?
    paid        = models.BooleanField() # have they completed payment for the ride?
    sale        = models.ForeignKey(Sale, blank=True, null=True) # what is the sale that this transaction happened through?

    class Meta:
        db_table    = 'rides_riders'
        app_label   = 'rides'