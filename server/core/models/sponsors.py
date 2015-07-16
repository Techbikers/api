from time import time
from django.db import models
from django.db.models.signals import post_delete
from django.conf import settings
from django.dispatch import receiver
from django.contrib.auth.models import User

from server.core.models.rides import Ride

def generate_filename(instance, filename):
    ext = filename.split('.')[-1]
    return 'sponsor_logos/' + str(int(time())) + '.' + ext


class Sponsor(models.Model):
    organisation = models.CharField(max_length='255')
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to=generate_filename)
    website = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    # Rides this sponsor has sponsored
    rides = models.ManyToManyField(Ride, through='RideSponsor', blank=True)
    # Riders who work for this sponsor
    riders = models.ManyToManyField(User, blank=True)

    def __unicode__(self):
        return self.organisation

    @receiver(post_delete, sender='core.Sponsor')
    def delete_sponsor_logo(sender, instance=None, **kwargs):
        storage, path = instance.logo.storage, instance.logo.path
        storage.delete(path)

    class Meta:
        db_table = 'sponsors'


class RideSponsor(models.Model):
    # Define the different sponsor levels
    GOLD = 'gold'
    SILVER = 'silver'
    BRONZE = 'bronze'
    BOTTLE = 'bottle'
    KIT = 'kit'
    IN_KIND = 'inkind'
    HOMECOMING = 'homecoming'
    SPONSOR_LEVELS = (
        (GOLD, 'Gold Level'),
        (SILVER, 'Silver Level'),
        (BRONZE, 'Bronze Level'),
        (BOTTLE, 'Bottle'),
        (KIT, 'Kit'),
        (IN_KIND, 'In Kind'),
        (HOMECOMING, 'Homecoming Party'),
    )

    ride = models.ForeignKey(Ride)
    sponsor = models.ForeignKey(Sponsor)
    sponsor_level = models.CharField(max_length=10, choices=SPONSOR_LEVELS)

    class Meta:
        db_table = 'ride_sponsors'
        unique_together = ('ride', 'sponsor')