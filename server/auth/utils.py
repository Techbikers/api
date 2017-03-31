import urllib
import requests
import jwt
from datetime import datetime
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.backends import default_backend
from django.core.cache import cache
from django.conf import settings

def get_auth0_public_key(cert_url):
    """
    Using the URL for a public certificate, create the RSA certificate object
    and return the public key
    """

    cert_file = urllib.urlopen(cert_url)
    cert_obj = load_pem_x509_certificate(cert_file.read(), default_backend())

    return cert_obj.public_key()


def get_auth0_management_token():
    """
    This gets an access token for the Auth0 management API. This is needed in
    order to make calls to the API (e.g. to get user information). These tokens
    expire so we cache them in local memory to avoid making an API call every
    time we want to access the management API. Once the token has expired (or
    we can't find one in memory) then we fetch a new one.
    """

    token = cache.get('auth0_access_token', None)

    if not token:
        # We need to get a new token
        response = requests.post(
            settings.AUTH0_TOKEN_URL,
            json={
                'grant_type': 'client_credentials',
                'client_id': settings.AUTH0_CLIENT_ID,
                'client_secret': settings.AUTH0_CLIENT_SECRET,
                'audience': settings.AUTH0_CLIENT_AUDIENCE
            })
        response.raise_for_status()
        response_json = response.json()

        # Get the access token from the response
        token = response_json['access_token']

        # Store the token in the cache
        # TODO: This should expire from the cache before the token becomes
        #       invalid but we could store the expiration then explicity
        #       check the expiration of the token to be 100% sure.
        cache.set('auth0_access_token', token)

    return token
