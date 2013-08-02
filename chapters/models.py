from django.db import models
from rides.models import Ride

class Chapter(models.Model):
    name = models.CharField(max_length='255', unique=True)

    # Linked Entities

    class Meta:
        db_table    = 'chapters'
        app_label   = 'chapters'