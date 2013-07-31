from django.db import models
from django.contrib.auth.models import User

class RiderProfile(models.Model):
    # Link to main user record
    user = models.OneToOneField(User, primary_key = True)

    def __unicode__(self):
        return self.user.username