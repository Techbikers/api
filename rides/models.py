from datetime import datetime
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

    # Does this ride require pre-registration before signing up?
    preregistration_required = models.BooleanField(default=False)

    # Details to sign up riders
    rider_capacity = models.IntegerField(default = 0)
    price          = models.DecimalField(default = 0.00, max_digits = 6, decimal_places = 2)
    currency       = models.CharField(max_length = 3, choices=(('gbp', 'GBP'), ('usd', 'USD'), ('eur', 'EUR')), default = 'gbp')
    terms_and_conditions = models.TextField(null=True, blank = True, default='')

    # Linked Entities
    chapter        = models.ForeignKey('chapters.Chapter', null=True, blank=True)
    riders         = models.ManyToManyField(User, through='RideRiders', null=True, blank=True)

    # Calculated properties (not stored in the db)
    @property
    def spaces_left(self):
        return max(0, self.rider_capacity - self.riders.count())

    # Determine is the ride is over
    @property
    def is_over(self):
        return self.end_date <= datetime.now().date()

    def __unicode__(self):
        return self.name

    class Meta:
        db_table    = 'rides'
        app_label   = 'rides'


class RideRiders(models.Model):
    user = models.ForeignKey(User)
    ride = models.ForeignKey(Ride)

    # Other information we might want to know about a user signing up to a ride
    signup_date = models.DateTimeField(default=datetime.now())
    pending     = models.BooleanField() # is the spot reserved for them before paying?
    paid        = models.BooleanField() # have they completed payment for the ride?
    sale        = models.ForeignKey(Sale, blank=True, null=True) # what is the sale that this transaction happened through?

    class Meta:
        db_table    = 'rides_riders'
        app_label   = 'rides'
