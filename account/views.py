from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from rides.models import Ride, RideRiders

@login_required()
def index(request):
    # Get all the rides the user has done/is signed up for
    rides = RideRiders.objects.select_related().filter(user = request.user).order_by('signup_date')

    return render(request, 'account/index.html', {'rides': rides})