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

def details(request, slug = None):
    #ride = Ride.objects.get(slug = slug)
    #return render(request, 'rides/details.html', {'ride': ride})
    raise Http404