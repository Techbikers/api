import stripe
from datetime import datetime
from django.db import models
from django.contrib.auth.models import User


class Sale(models.Model):
    sale_date = models.DateTimeField(default=datetime.now())
    # store the stripe charge id for this sale
    charge_id = models.CharField(max_length=32)
    # also store the rider id
    rider = models.ForeignKey(User)

    def __init__(self, *args, **kwargs):
        super(Sale, self).__init__(*args, **kwargs)
 
    def charge(self, user, price_in_cents, number, exp_month, exp_year, cvc):
        """
        Takes a the price and credit card details: number, exp_month,
        exp_year, cvc.
 
        Returns a tuple: (Boolean, Class) where the boolean is if
        the charge was successful, and the class is response (or error)
        instance.
        """

        # stripe API key (hard-coded for testing, just noticed we should eventually pick this up via settings/your env instead)
        stripe.api_key = "sk_test_o6TUf6WqoPoMJmFl9BPjZl8i"
 
        if self.charge_id: # don't let this be charged twice!
            return False, Exception(message="Already charged.")
 
        try:
            response = stripe.Charge.create(
                amount = price_in_cents,
                currency = "gbp",
                card = {
                    "number" : number,
                    "exp_month" : exp_month,
                    "exp_year" : exp_year,
                    "cvc" : cvc,
 
                    #### it is recommended to include the address!
                    #"address_line1" : self.address1,
                    #"address_line2" : self.address2,
                    #"daddress_zip" : self.zip_code,
                    #"address_state" : self.state,
                },
                description='Thank you for your purchase!')
 
            self.charge_id = response.id
            self.rider_id = user.id
            self.save()
 
        except stripe.CardError, ce:
            # charge failed
            return False, ce
 
        return True, response
        
    class Meta:
        db_table    = 'sales'
        app_label   = 'sales'