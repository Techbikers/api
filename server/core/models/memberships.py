from datetime import datetime, timedelta
from django.db import models
from django.contrib.auth.models import User

from server.core.models.sales import Sale
from server.core.models.chapters import Chapter


def now_plus_a_year():
    return datetime.now().date() + timedelta(days=365)


class Membership(models.Model):
    user = models.ForeignKey(User)
    sale = models.ForeignKey(Sale, blank=True, null=True)
    # Riders are members of a specific chapter (which determines the membership fee)
    chapter = models.ForeignKey(Chapter)
    # Membership start
    start_date = models.DateField(auto_now_add=True)
    # Membership end (defaults to 365 days later... doesn't account for leap years)
    end_date = models.DateField(blank=True, null=True, default=now_plus_a_year())

    @property
    def expired(self):
        return self.end_date < datetime.now().date()

    class Meta:
        db_table = 'memberships'
