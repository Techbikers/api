import os
import json

from base import *

DEBUG = False

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTOCOL', 'https')

DEFAULT_DB_ALIAS = 'default'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': (os.path.join(BASE,'..','..','db','techbikers.sqlite')),
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

ALLOWED_HOSTS = ['api.techbikers.com']

STRIPE_ENVIRONMENT = 'live'

with open('../../production.json') as configFile:
    config = json.load(configFile);
    SECRET_KEY = config.get('secret_key')

    email = config.get('email')
    # Sendgrid API
    SENDGRID_API_KEY = email.get('sendgrid_api_key')
    # Mailchimp API
    MAILCHIMP_API_URL = email.get('mailchimp_api_url')
    MAILCHIMP_API_KEY = email.get('mailchimp_api_key')
    MAILCHIMP_CORE_LIST_ID = email.get('mailchimp_core_list_id')
    # Just Giving API
    JUSTGIVING_API_KEY = config.get('justgiving_api_key')
    JUSTGIVING_API_SECRET = config.get('justgiving_api_secret')
    JUSTGIVING_API_URL = 'https://api.justgiving.com/v1'

    # Slack Bot Settings
    SLACK_CHANNEL = '#updates'
    SLACK_TOKEN = config.get('slack_bot_token')
    SLACK_BACKEND = 'django_slack.backends.UrllibBackend'

    # Auth0 Settings
    auth0 = config.get('auth0')
    AUTH0_CLIENT_ID = auth0.get('client_id')
    AUTH0_CLIENT_SECRET = auth0.get('client_secret')

    # Auth0 uses the client ID as the audience (note that this is not the same
    # client as above). We need to set this so we can properly verify tokens
    # sent to us during API requests
    JWT_AUTH['JWT_AUDIENCE'] = auth0.get('web_client_id')

    RAVEN_CONFIG = {
        'dsn': config.get('sentry_dsn')
    }

MEDIA_ROOT = '/home/django/techbikers.com/media'
STATIC_ROOT = '/home/django/techbikers.com/static'

# Production Logging
LOGGING['handlers']['log_file'] = {
    'level': 'DEBUG',
    'class': 'logging.FileHandler',
    'filters': ['require_debug_false'],
    'filename': '/home/django/techbikers.com/logs/debug.log',
    'formatter': 'verbose',
}
