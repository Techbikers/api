from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required
from django.conf import settings

from rides.models import Ride, RideRiders
from sales.models import Sale
from sales.forms import RideCheckoutForm

import stripe

@login_required(login_url="/riders/register")
def checkout(request, ride_id):
    try:
        # Get the ride info
        ride = Ride.objects.get(id = ride_id)
    except Ride.DoesNotExist:
        return render(request, 'sales/error.html', {'error': "You did not specify a ride!"})

    if request.method == "POST":
        form = RideCheckoutForm(request.POST)
    else:
        form = RideCheckoutForm()

    # If the user has the secret key then they can register regardless of spaces left
    has_sales_key = request.GET.get('key', None) == settings.SECRET_SALES_KEY
    full = ride.spaces_left < 1 and not has_sales_key

    variables  = {
        'ride': ride,
        'form': form,
        'signed_up': False,
        'full': full
    }

    # Check to see if the rider is already signed up to this ride
    # There must be a better way of doing this
    try:
        ride.rideriders_set.get(user = request.user)
        variables['signed_up'] = True
    except RideRiders.DoesNotExist:
        pass

    if not full and request.method == "POST" and form.is_valid():
        # If the ride costs something then attempt to create a sale object
        # and charge the user for the ride.
        if ride.price > 0:
            token = form.cleaned_data['stripe_token']

            try:
                sale = Sale.charge(request.user, ride, token)
                sale.save()
            except stripe.CardError:
                return render(request, 'sales/error.html',
                    {'error': 'Something went wrong when processing your payment. Please get in touch with us!'})
        else:
            sale = False

        # So we've now successfully charged the user so lets make sure they are
        # signed up to the ride
        ride_rider = RideRiders()
        ride_rider.user = request.user
        ride_rider.ride = ride
        ride_rider.paid = True
        if sale:
            ride_rider.sale = sale
        ride_rider.save()

        return render(request, 'sales/success.html', {'ride': ride})
    else:
        return render(request, 'sales/checkout.html', variables)

@login_required
def terms(request, ride_id):
    try:
        # Get the ride info
        ride = Ride.objects.get(id = ride_id)
    except Ride.DoesNotExist:
        return render(request, 'sales/error.html', {'error': "You did not specify a ride!"})

    return render(request, 'sales/terms.html', {'ride': ride})