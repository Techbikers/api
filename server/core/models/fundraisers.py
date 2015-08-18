from django.db import models
from django.contrib.auth.models import User
from server.core.models.rides import Ride


class Fundraiser(models.Model):
    user = models.ForeignKey(User)
    ride = models.ForeignKey(Ride)
    pageId = models.IntegerField()
    pageUrl = models.URLField()
    signOnUrl = models.URLField(blank=True, null=True)

    class Meta:
        db_table = 'fundraisers'
        unique_together = ('user', 'ride')