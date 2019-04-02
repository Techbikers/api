import os
import json
import requests

from base import *
from server.settings.settings_model import Settings

# Use the App Engine Requests adapter. This makes sure that Requests uses URLFetch.
from requests_toolbelt.adapters import appengine
appengine.monkeypatch()

DEBUG = False

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTOCOL', 'https')

DEFAULT_DB_ALIAS = 'default'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': '/cloudsql/nimble-airline-178615:europe-west1:techbikers-db',
        'PORT': '3306',
        'NAME': 'techbikers',
        'USER': Settings.get('TECHBIKERS_DB_USER'),
        'PASSWORD': Settings.get('TECHBIKERS_DB_PASSWORD')
    }
}

ALLOWED_HOSTS = ['api.techbikers.com', 'nimble-airline-178615.appspot.com']

STRIPE_ENVIRONMENT = 'live'

SECRET_KEY = Settings.get('SECRET_KEY')

# Sendgrid API
SENDGRID_API_KEY = Settings.get('SENDGRID_API_KEY')

# Mailchimp API
MAILCHIMP_API_URL = Settings.get('MAILCHIMP_API_URL')
MAILCHIMP_API_KEY = Settings.get('MAILCHIMP_API_KEY')
MAILCHIMP_CORE_LIST_ID = Settings.get('MAILCHIMP_CORE_LIST_ID')

# Just Giving API
JUSTGIVING_API_KEY = Settings.get('JUSTGIVING_API_KEY')
JUSTGIVING_API_SECRET = Settings.get('JUSTGIVING_API_SECRET')
JUSTGIVING_API_URL = 'https://api.justgiving.com/v1'
JUSTGIVING_AUTH_URL = 'https://identity.justgiving.com'
JUSTGIVING_REDIRECT_URI = 'https://techbikers.com/oauth/callback'

# Slack Bot Settings
SLACK_CHANNEL = '#updates'
SLACK_TOKEN = Settings.get('SLACK_BOT_TOKEN')
SLACK_BACKEND = 'django_slack.backends.UrllibBackend'

# Auth0 Settings
AUTH0_CLIENT_ID = Settings.get('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET = Settings.get('AUTH0_CLIENT_SECRET')

# Auth0 uses the client ID as the audience (note that this is not the same
# client as above). We need to set this so we can properly verify tokens
# sent to us during API requests
JWT_AUTH['JWT_AUDIENCE'] = Settings.get('AUTH0_WEB_CLIENT_ID')

RAVEN_CONFIG = {
    'dsn': Settings.get('SENTRY_DSN')
}

MEDIA_ROOT = 'media'
STATIC_ROOT = 'static'
