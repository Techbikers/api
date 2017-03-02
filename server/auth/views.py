from django.shortcuts import render
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import never_cache

from social.actions import do_auth
from social.apps.django_app.utils import psa


@never_cache
@psa('auth:complete')
def auth(request, backend):
    """
    Start the authentication flow
    """
    return do_auth(request.backend, redirect_name=REDIRECT_FIELD_NAME)


@never_cache
@csrf_exempt
@psa('auth:complete')
def complete(request, backend):
    """
    Handle the response from the authentication provider
    """
    return render(request, 'auth_complete.html')
