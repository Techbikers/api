from django.shortcuts import render, redirect
from django.template.defaultfilters import slugify
from django.http import Http404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from riders.forms import RiderRegistration
from riders.models import RiderProfile


def index(request):
    #return render(request, 'riders/index.html')
    raise Http404


def login(request):
    if request.user.is_authenticated():
        return redirect('riders.views.index')
    else:
        if request.method == 'GET':
            if request.user.is_authenticated():
                return redirect('riders.views.index')

            return render(request, 'riders/login.html', {'next': request.GET.get('next')})

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
                        return redirect('riders.views.index')
                else:
                    return render(request, 'riders/login.html', {'errors': 'Account disabled'})
            else:
                return render(request, 'riders/login.html', {'errors': 'Incorrect username or password'})


def logout(request):
    auth_logout(request)
    return redirect('riders.views.index')


def register(request):
    if request.user.is_authenticated():
        return redirect("riders.views.index")
    else:
        if request.method == "GET":
            # Initialise the signup form
            form = RiderRegistration(auto_id=True)
            return render(request, 'riders/register.html', {"form": form, 'next': request.GET.get('next')})

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


def profile(request, id, slug = None):
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

    return render(request, "riders/profile.html", {"profile": user})