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

with open('../../production.json') as configFile:
    config = json.load(configFile);
    SECRET_KEY = config.get('secret_key')
    email = config.get('email')
    EMAIL_HOST = os.environ.get('EMAIL_HOST',email.get('host'))
    EMAIL_PORT = os.environ.get('EMAIL_PORT', email.get('port'))
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER',email.get('user'))
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', email.get('password'))
    stripe = config.get('stripe')
    STRIPE_PUBLIC_KEY = stripe.get('public_key')
    STRIPE_SECRET_KEY = stripe.get('secret_key')
    


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_USE_TLS = False
DEFAULT_FROM_EMAIL = 'admin@techbikers.com'

STATIC_ROOT = '/home/django/techbikers.com/static'

