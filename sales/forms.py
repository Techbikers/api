from django import forms

from rides.models import Ride

class RideCheckoutForm(forms.Form):
    stripe_token = forms.CharField(widget=forms.HiddenInput())
    tnc = forms.BooleanField(
        error_messages={'required': 'Please accept our Terms and Conditions.'}
    )
