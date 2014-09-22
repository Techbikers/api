from datetime import datetime
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rides.models import Ride, RideRiders
from account.forms import ChangePassword

@login_required()
def index(request):
    user = request.user

    # Get all the rides the user has done/is signed up for
    rides = Ride.objects.filter(riders__id=user.id)
    current_rides = rides.filter(end_date__gte=datetime.now()).order_by('-start_date')
    past_rides = rides.filter(end_date__lte=datetime.now()).order_by('-start_date')

    return render(request, 'account/index.html', {
        'user': user,
        'current_rides': current_rides,
        'past_rides': past_rides
    })


@login_required()
def changepassword(request):
    if request.method == "GET":
        form = ChangePassword(auto_id=True)
        return render(request, 'account/changepassword.html', {"form": form})
    else:
        form = ChangePassword(request.POST)
        if form.is_valid():
            # Check if the current password is valid
            if request.user.check_password(form.cleaned_data["oldpassword"]):
                request.user.set_password(form.cleaned_data["newpassword1"])
                request.user.save()
                return render(request, "account/changepassword.html", {"form": form, "success": True})
            else:
                return render(request, "account/changepassword.html", {"form": form, "error": "The current password entered is incorrect."})
        else:
            return render(request, "account/changepassword.html", {"form": form, "error": form.errors})