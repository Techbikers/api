import stripe
from datetime import datetime
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Sale(models.Model):
    sale_date   = models.DateTimeField(default=datetime.now())
    charge_id   = models.CharField(max_length=32) # store the stripe charge id for this sale
    amount      = models.IntegerField(null=True, blank=True)
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
    def charge(cls, token, key, price, currency, description, email):
        """
        Charges a users card using the Stripe token obtained and
        details of the transaction. If successful we pass back a
        sale object with the transaction details.

        price: to be sent through in cents/pennies
            i.e. for GBP 3 we pass through 300

        key: this is the private Stripe key

        currency: a string of the 3 letter ISO code
            e.g. gbp or eur

        description: this will be sent to the customer so they
            can identify the transaction

        Raises a stripe.CardError on errors.
        """

        instance = cls()
        stripe.api_key = key

        try:
            response = stripe.Charge.create(
                amount=price,
                currency=currency,
                source=token,
                description=description,
                receipt_email=email)
        except Exception, e:
            raise e

        instance.charge_id = response.id
        instance.amount = response.amount
        instance.currency = response.currency
        instance.livemode = response.livemode
        instance.card = response.card.id

        return instance

    class Meta:
        db_table    = 'sales'