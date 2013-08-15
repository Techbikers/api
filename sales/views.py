from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required
from django.conf import settings

from rides.models import Ride, RideRiders
from sales.models import Sale


@require_GET
@login_required()
def checkout(request):
    # Get the ride id from the POST data
    ride_id = request.GET.get('ride', None)

    if ride_id:
        # Get the ride info
        ride = Ride.objects.get(id = ride_id)

        # Check to see if the rider is already signed up to this ride
        # There must be a better way of doing this
        try:
            ride_rider = ride.rideriders_set.get(user = request.user)
        except:
            ride_rider = None

        if ride_rider:
            return render(request, 'sales/checkout.html', {'ride': ride, 'signed_up': True})
        elif ride.spaces_left < 1:
            # If the ride is full then don't let them pay for it
            return render(request, 'sales/checkout.html', {'ride': ride, 'full': True})
        else:
            return render(request, 'sales/checkout.html', {'ride': ride, 'key': settings.STRIPE_PUBLIC_KEY})
    else:
        return render(request, 'sales/checkout.html', {'error': "Nothing to checkout!"})


@require_POST
@login_required()
def charge(request):
    # Get the form data
    token = request.POST.get('stripeToken')

    # Get the ride id from the POST data
    ride_id = request.POST.get('ride', None)

    # Get the ride info
    ride = Ride.objects.get(id = ride_id)

    # Create a new sale record
    sale = Sale()

    # Get the ride price, pass user so we can store the user id and charge id in a sale record
    success, instance = sale.charge(request.user, int(ride.price*100), token)

    if not success:
        return render(request, 'sales/error.html', {'error': instance.message})
    else:
        instance.save()

        # So we've now successfully charged the user so lets make sure they are signed up to the ride
        ride_rider = RideRiders()
        ride_rider.user = request.user
        ride_rider.ride = ride
        ride_rider.paid = True
        ride_rider.sale = sale
        ride_rider.save()

        pass

    return redirect('/sales/success')


def success(request):
    return render(request, 'sales/success.html')