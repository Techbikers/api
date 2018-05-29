from datetime import datetime
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from server.fundraisers.models import Fundraiser


class RiderProfile(models.Model):
    # Link to main user record
    user = models.OneToOneField(User, primary_key = True, related_name="profile")

    # Extended User Information
    company = models.CharField(max_length=200, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    twitter = models.CharField(max_length=200, null=True, blank=True)

    biography = models.TextField(null=True, blank=True)
    statement = models.TextField(null=True, blank=True)

    def __unicode__(self):
        return self.user.username

    @property
    def donation_page(self):
        fundraisers = Fundraiser.objects.filter(user=self.user)
        if fundraisers.count() > 0:
            return fundraisers.last().pageUrl
        else:
            return None

    @receiver(post_save, sender=User)
    def create_profile_for_user(sender, instance=None, created=False, **kwargs):
        if created:
            RiderProfile.objects.get_or_create(user=instance)

    @receiver(pre_delete, sender=User)
    def delete_profile_for_user(sender, instance=None, **kwargs):
        if instance:
            rider_profile = RiderProfile.objects.get(user=instance)
            rider_profile.delete()

    class Meta:
        db_table    = "riders_profiles"
