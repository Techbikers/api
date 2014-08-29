from django.shortcuts import render, redirect
from django.template.defaultfilters import slugify
from django.http import Http404
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from riders.forms import RiderRegistration, RiderDetails
from riders.models import RiderProfile
from rides.models import Ride


def index(request):
    #return render(request, 'riders/index.html')
    raise Http404


def login(request):
    if request.user.is_authenticated():
        # See if the user needs redirecting
        next_page = request.GET.get('next', None)
        if next_page:
            return redirect(next_page)
        else:
            return redirect(settings.LOGIN_REDIRECT_URL)
    else:
        if request.method == 'GET':
            if request.user.is_authenticated():
                return redirect('riders.views.index')

            return render(request, 'riders/login.html', {'next': request.GET.get('next', '')})

        elif request.method == 'POST':
            username = request.POST['email']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    auth_login(request, user)

                    # See if the user needs redirecting
                    next_page = request.POST.get('next', None)
                    if next_page:
                        return redirect(next_page)
                    else:
                        return redirect(settings.LOGIN_REDIRECT_URL)
                else:
                    return render(request, 'riders/login.html', {'errors': 'Account disabled'})
            else:
                return render(request, 'riders/login.html', {'errors': 'Incorrect username or password'})


def logout(request):
    auth_logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)


def register(request):
    if request.user.is_authenticated():
        # See if the user needs redirecting
        next_page = request.GET.get('next', None)
        if next_page:
            return redirect(next_page)
        else:
            return redirect(settings.LOGIN_REDIRECT_URL)
    else:
        if request.method == "GET":
            # Initialise the signup form
            form = RiderRegistration(auto_id=True)
            return render(request, 'riders/register.html', {"form": form, 'next': request.GET.get('next', '')})

        elif request.method == "POST":
            form = RiderRegistration(request.POST)
            if form.is_valid():
                # Get the form data
                email    = form.clean_email()
                password = form.cleaned_data["password1"]
                # Create the new user
                new_user = User.objects.create_user(email, email, password)
                new_user.first_name = form.cleaned_data["firstname"]
                new_user.last_name = form.cleaned_data["lastname"]
                new_user.save()

                # Create a blank user profile
                profile = RiderProfile.objects.create(user=new_user)
                profile.company = form.cleaned_data["company"]
                profile.website = form.cleaned_data["website"]
                profile.twitter = form.cleaned_data["twitter"]
                profile.save()

                # Log the user in
                user = authenticate(username=email, password=password)
                auth_login(request, user)

                # See if the user needs redirecting
                next_page = request.POST.get('next', None)
                if next_page:
                    return redirect(next_page)
                else:
                    return redirect('/')
            else:
                # Errors in the form so return with the errors
                return render(request, 'riders/register.html', {"form": form})


def profile(request, id, slug = None, action = None):
    # Try and get the user from the id
    try:
        user = User.objects.get(id = id)
    except User.DoesNotExist:
        raise Http404

    # Get the user slug
    user_slug = slugify(user.get_full_name())

    # Check if the name is in the url, redirect if not
    if not slug:
        return redirect("/riders/%s/%s" % (user.id, user_slug))

    # Check if the title is the right one, throw error if not to stop bad linking
    if slug != user_slug:
        raise Http404

    # Are we in editing mode and if so, is the user allowed to edit this profile?
    form = None
    if action == "edit":
        if not request.user.is_authenticated() or request.user.id != user.id:
            return redirect("/riders/%s/%s" % (user.id, user_slug))
        else:
            form = RiderDetails(initial={
                "firstname": user.first_name,
                "lastname": user.last_name,
                "company": user.profile.company,
                "website": user.profile.website,
                "twitter": user.profile.twitter,
                "biography": user.profile.biography,
                "statement": user.profile.statement
            })
    else:
        if request.user.id == user.id:
            action = "can_edit"

    # Get all the rides the user has done/is signed up for
    rides = Ride.objects.filter(riders__id=user.id).order_by('start_date')

    if request.method == "GET":
        return render(request, "riders/profile.html", {
            "user": user,
            "rides": rides,
            "action": action,
            "form": form
        })
    elif request.method == "POST":
        form = RiderDetails(request.POST)
        if form.is_valid():
            user.first_name = form.cleaned_data["firstname"]
            user.last_name = form.cleaned_data["lastname"]
            user.save()

            user_profile = RiderProfile.objects.get(user = user)
            user_profile.company = form.cleaned_data["company"]
            user_profile.website = form.cleaned_data["website"]
            user_profile.twitter = form.cleaned_data["twitter"]
            user_profile.biography = form.cleaned_data["biography"]
            user_profile.statement = form.cleaned_data["statement"]
            user_profile.save()

            # Update user_slug just in case they changed their name
            user_slug = slugify(user.get_full_name())

            return redirect("/riders/%s/%s" % (user.id, user_slug))

        else:
            # Errors in the form so return with the errors
            return render(request, "riders/profile.html", {
                "user": user,
                "rides": rides,
                "action": action,
                "form": form
            })