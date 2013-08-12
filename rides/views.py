from django.shortcuts import render, redirect
from django.template.defaultfilters import slugify
from django.http import Http404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from riders.forms import RiderRegistration
from rides.models import Ride


def index(request):
    rides = Ride.objects.all()
    #return render(request, 'rides/index.html', {'rides': rides})
    raise Http404

def details(request, slug = None):
    #ride = Ride.objects.get(slug = slug)
    #return render(request, 'rides/details.html', {'ride': ride})
    raise Http404