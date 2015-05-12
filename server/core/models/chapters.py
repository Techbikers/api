from django.db import models
from django.conf import settings

class Chapter(models.Model):
    name = models.CharField(max_length='255', unique=True)
    stripe_priv_key = models.CharField(max_length=255, null=True, blank=True, default='')
    stripe_pub_key = models.CharField(max_length=255, null=True, blank=True, default='')
    stripe_test_priv_key = models.CharField(max_length=255, null=True, blank=True, default='')
    stripe_test_pub_key = models.CharField(max_length=255, null=True, blank=True, default='')

    # Linked Entities

    def __unicode__(self):
        return self.name

    def get_priv_key(self):
        if settings.STRIPE_ENVIRONMENT == 'live':
            return self.stripe_priv_key
        else:
            return self.stripe_test_priv_key

    def get_pub_key(self):
        if settings.STRIPE_ENVIRONMENT == 'live':
            return self.stripe_pub_key
        else:
            return self.stripe_test_pub_key

    class Meta:
        db_table    = 'chapters'