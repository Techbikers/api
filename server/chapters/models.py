from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class Chapter(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    currency = models.CharField(max_length = 3, choices=(('gbp', 'GBP'), ('usd', 'USD'), ('eur', 'EUR')), default = 'gbp')
    stripe_priv_key = models.CharField(max_length=255, null=True, blank=True, default='')
    stripe_pub_key = models.CharField(max_length=255, null=True, blank=True, default='')
    stripe_test_priv_key = models.CharField(max_length=255, null=True, blank=True, default='')
    stripe_test_pub_key = models.CharField(max_length=255, null=True, blank=True, default='')

    def __unicode__(self):
        return self.name

    @property
    def private_key(self):
        if settings.STRIPE_ENVIRONMENT == 'live':
            return self.stripe_priv_key
        else:
            return self.stripe_test_priv_key

    @property
    def public_key(self):
        if settings.STRIPE_ENVIRONMENT == 'live':
            return self.stripe_pub_key
        else:
            return self.stripe_test_pub_key

    class Meta:
        db_table    = 'chapters'
