from django.db import models
from django.contrib.auth.models import User

class RiderProfile(models.Model):
    # Link to main user record
    user = models.OneToOneField(User, primary_key = True)

    # Extended User Information
    company = models.CharField(max_length=200, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    twitter = models.CharField(max_length=200, null=True, blank=True)

    biography = models.TextField(blank=True)

    def __unicode__(self):
        return self.user.username

    class Meta:
        db_table    = "riders_profiles"
        app_label   = 'riders'