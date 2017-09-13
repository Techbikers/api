import requests
from urlparse import urlparse
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from server.models.rides import Ride


class Fundraiser(models.Model):
    user = models.ForeignKey(User)
    ride = models.ForeignKey(Ride)
    pageId = models.IntegerField()
    pageStatus = models.BooleanField(default=True)
    pageUrl = models.URLField()
    signOnUrl = models.URLField(blank=True, null=True)
    currency = models.CharField(max_length = 3, default = 'GBP')
    manuallyCreated = models.BooleanField(default=False)

    # Fundraising details
    fundraisingTarget = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    totalRaisedOffline = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    totalRaisedOnline = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    totalRaisedSms = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    totalRaised = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
    giftAid = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)

    @property
    def pageShortName(self):
        return urlparse(self.pageUrl).path

    @property
    def progress(self):
        if self.totalRaised and self.fundraisingTarget:
            return self.totalRaised / self.fundraisingTarget
        else:
            return 0

    def fetch_details(self, *args, **kwargs):
        """
        Get fundraising details from the Just Giving API and update the
        record with the latest details.
        """
        try:
            response = requests.get(
                '{0}/fundraising/pages{1}'.format(settings.JUSTGIVING_API_URL, self.pageShortName),
                headers={
                    'x-api-key': settings.JUSTGIVING_API_KEY,
                    'x-application-key': settings.JUSTGIVING_API_SECRET,
                    'Content-Type': 'application/json'})
            response_json = response.json()

            # Update the model with the results
            self.pageStatus = response_json.get("status", "Active") == "Active"
            self.currency = response_json.get("currencyCode", self.currency)
            self.fundraisingTarget = response_json.get("fundraisingTarget", self.fundraisingTarget)
            self.totalRaisedOffline = response_json.get("totalRaisedOffline", self.totalRaisedOffline)
            self.totalRaisedOnline = response_json.get("totalRaisedOnline", self.totalRaisedOnline)
            self.totalRaisedSms = response_json.get("totalRaisedSms", self.totalRaisedSms)
            self.totalRaised = response_json.get("grandTotalRaisedExcludingGiftAid", self.totalRaised)
            self.giftAid = response_json.get("totalEstimatedGiftAid", self.giftAid)

            return self.save()

        except requests.exceptions.RequestException, e:
            raise e


    class Meta:
        db_table = 'fundraisers'
        unique_together = ('user', 'ride')
