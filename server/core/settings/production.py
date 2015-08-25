import os
import json
import sys

from os.path import join, normpath

from base import *

DEBUG = False
INSTALLED_APPS += (
    # other apps for production site
    "gunicorn",
)

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTOCOL', 'https')

DEFAULT_DB_ALIAS = 'default'

DATABASES = {
    'default': {
         # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': (os.path.join(BASE,'..','..','db','techbikers.sqlite')),
        # The following settings are not used with sqlite3:
        'USER': '',
        'PASSWORD': '',
        # Host is empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'HOST': '',
        'PORT': '',
    }
}

ALLOWED_HOSTS = ['techbikers.com','spoke.techbikers.com']

STRIPE_ENVIRONMENT = 'live'

with open('../../production.json') as configFile:
    config = json.load(configFile);
    SECRET_KEY = config.get('secret_key')
    email = config.get('email')
    MANDRILL_API_KEY = os.environ.get('MANDRILL_API_KEY', email.get('mandrill_api_key'))
    MANDRILL_SUBACCOUNT = os.environ.get('MANDRILL_SUBACCOUNT', email.get('mandrill_subaccount'))
    JUST_GIVING_API_URL = 'https://api.justgiving.com/v1'
    JUST_GIVING_API_KEY = config.get('just_giving_api_key')

    social_auth = config.get('social_auth')
    SOCIAL_AUTH_FACEBOOK_KEY = social_auth.get('facebook_key')
    SOCIAL_AUTH_FACEBOOK_SECRET = social_auth.get('facebook_secret')

MEDIA_ROOT = '/home/django/techbikers.com/media'
STATIC_ROOT = '/home/django/techbikers.com/static'

