from django.db import models
from django.contrib.auth.models import User
from riders.models import RiderProfile
 
class Sale(models.Model):
    def __init__(self, *args, **kwargs):
        super(Sale, self).__init__(*args, **kwargs)
 
        # bring in stripe
        import stripe
        # strip API key
        stripe.api_key = "sk_test_o6TUf6WqoPoMJmFl9BPjZl8i"
 
        self.stripe = stripe
 
    # store the stripe charge id for this sale
    charge_id = models.CharField(max_length=32)
    
    # also store the rider id, not sure what type this should be?
    rider_id = models.CharField(max_length=32)
 
    # you could also store other information about the sale
    # but I'll leave that to you!
 
    def charge(self, user_id, price_in_cents, number, exp_month, exp_year, cvc):
        """
        Takes a the price and credit card details: number, exp_month,
        exp_year, cvc.
 
        Returns a tuple: (Boolean, Class) where the boolean is if
        the charge was successful, and the class is response (or error)
        instance.
        """
 
        if self.charge_id: # don't let this be charged twice!
            return False, Exception(message="Already charged.")
 
        try:
            response = self.stripe.Charge.create(
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
            # this (getting the current rider profile) doesn't seem elegant, but...
            curr_user = User.objects.get(id = user_id)
            rider = RiderProfile.objects.get(user = curr_user)
            rider.charge_id = self.charge_id
            self.rider_id = curr_user.id
            self.save()
            rider.save()
 
        except self.stripe.CardError, ce:
            # charge failed
            return False, ce
 
        return True, response
        
    class Meta:
        db_table    = 'sales'
        app_label   = 'sales'