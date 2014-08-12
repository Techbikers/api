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

    @classmethod
    def charge(cls, user, ride, token):
        """
        Takes a the price and a Stripe token.
 
        Raises a stripe.CardError on errors.
        """

        instance = cls()

        stripe.api_key = ride.chapter.get_priv_key()

        try:
            response = stripe.Charge.create(
                amount = int(ride.price * 100), # in cents
                currency = ride.currency,
                card = token,
                receipt_email = user.email,
                description = "{}: {}".format(ride.name, user.email))
        except stripe.CardError:
            raise # Just be explicit about what we are raising

        instance.charge_id = response.id
        instance.amount = response.amount
        instance.currency = response.currency
        instance.livemode = response.livemode
        instance.card = response.card.id
        instance.rider_id = user.id
 
        return instance
        
    class Meta:
        db_table    = 'sales'
        app_label   = 'sales'