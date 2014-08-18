from django.shortcuts import render
from rides.models import Ride


def index(request):
    return render(request, 'index.html')
