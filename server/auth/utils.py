import urllib
import requests
import jwt
import ssl
from datetime import datetime
from binascii import a2b_base64
from Crypto.PublicKey import RSA
from Crypto.Util.asn1 import DerSequence
from django.core.cache import cache
from django.conf import settings

def get_auth0_public_key(cert_url):
    """
    Using the URL for a public certificate, create the RSA certificate object
    and return the public key
    """

    cert_file = urllib.urlopen(cert_url)
    cert_obj = cert_file.read()

    # Convert from PEM to DER
    der = ssl.PEM_cert_to_DER_cert(cert_obj)

    # Extract subjectPublicKeyInfo field from X.509 certificate (see RFC3280)
    cert = DerSequence()
    cert.decode(der)
    tbsCertificate = DerSequence()
    tbsCertificate.decode(cert[0])
    subjectPublicKeyInfo = tbsCertificate[6]

    # Initialize RSA key
    rsa_key = RSA.importKey(subjectPublicKeyInfo)

    return rsa_key


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
