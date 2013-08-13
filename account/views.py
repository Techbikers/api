from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, Http404
from django.utils import simplejson
from rides.models import Ride, RideRiders
from account.forms import ChangePassword

@login_required()
def index(request):
    # Get all the rides the user has done/is signed up for
    rides = RideRiders.objects.select_related().filter(user = request.user).order_by('signup_date')

    return render(request, 'account/index.html', {'rides': rides})


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