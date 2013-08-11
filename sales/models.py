import stripe
from datetime import datetime
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Sale(models.Model):
    sale_date   = models.DateTimeField(default=datetime.now())
    charge_id   = models.CharField(max_length=32) # store the stripe charge id for this sale
    amount      = models.IntegerField(max_length=6, null=True, blank=True)
    livemode    = models.BooleanField()
    card        = models.CharField(blank=True, null=True, max_length=255)
    # also store the rider id
    rider       = models.ForeignKey(User)

    def __init__(self, *args, **kwargs):
        super(Sale, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return self.charge_id
 
    def charge(self, user, price_in_cents, token):
        """
        Takes a the price and credit card details: number, exp_month,
        exp_year, cvc.
 
        Returns a tuple: (Boolean, Class) where the boolean is if
        the charge was successful, and the class is response (or error)
        instance.
        """

        # stripe API key
        stripe.api_key = settings.STRIPE_SECRET_KEY
 
        if self.charge_id: # don't let this be charged twice!
            return False, Exception(message="Already charged.")
 
        try:
            response = stripe.Charge.create(
                amount = price_in_cents,
                currency = "gbp",
                card = token,
                description = user.email)
 
            self.charge_id = response.id
            self.amount = response.amount
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