import stripe
from datetime import datetime
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Sale(models.Model):
    sale_date   = models.DateTimeField(default=datetime.now())
    charge_id   = models.CharField(max_length=32) # store the stripe charge id for this sale
    amount      = models.IntegerField(max_length=6, null=True, blank=True)
    currency    = models.CharField(max_length = 3, choices=(('gbp', 'GBP'), ('usd', 'USD'), ('eur', 'EUR')), default = 'gbp')
    livemode    = models.BooleanField()
    card        = models.CharField(blank=True, null=True, max_length=255)
    # also store the rider id
    rider       = models.ForeignKey(User)

    def __init__(self, *args, **kwargs):
        super(Sale, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return self.charge_id
 
    def charge(self, user, price_in_cents, currency, token, priv_key):
        """
        Takes a the price and a Stripe token.
 
        Returns a tuple: (Boolean, Class) where the boolean is if
        the charge was successful, and the class is response (or error)
        instance.
        """

        # stripe API key
        stripe.api_key = priv_key
 
        if self.charge_id: # don't let this be charged twice!
            return False, Exception(message="Already charged.")
 
        try:
            response = stripe.Charge.create(
                amount = price_in_cents,
                currency = currency,
                card = token,
                description = user.email)

            self.charge_id = response.id
            self.amount = response.amount
            self.currency = response.currency
            self.livemode = response.livemode
            self.card = response.card.id
            self.rider_id = user.id
            self.save()
 
        except stripe.CardError, ce:
            # charge failed
            return False, ce
 
        return True, response
        
    class Meta:
        db_table    = 'sales'
        app_label   = 'sales'