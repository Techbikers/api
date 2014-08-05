from django.shortcuts import render, redirect
from django.template.defaultfilters import slugify
from django.http import Http404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from riders.forms import RiderRegistration
from rides.models import Ride


def index(request):
    # Get the ride - harcoded for the first run of this site.
    ride = Ride.objects.get(id = 2)
    return render(request, 'rides/index.html', {'ride': ride})


def details(request, id, slug = None):
    # Try and get the ride details from the id
    try:
        ride = Ride.objects.get(id = id)
    except Ride.DoesNotExist:
        raise Http404

    # Check if the name is in the url, redirect if not
    if not slug:
        return redirect("/rides/%s/%s" % (ride.id, ride.slug))

    # Check if the title is the right one, throw error if not to stop bad linking
    if slug != ride.slug:
        raise Http404

    return render(request, 'rides/details.html', {'ride': ride})