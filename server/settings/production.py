import os
import json

from base import *

DEBUG = False

INSTALLED_APPS += (
    # other apps for production site
    "gunicorn",
)

CRONJOBS = [
    ('*/15 * * * *', 'server.cronjobs.update_fundraisers'),
    ('* */2 * * *', 'server.cronjobs.batch_update_mailchimp_list')
]
CRONTAB_COMMAND_PREFIX = 'cd /home/django/techbikers.com/releases/current;'
CRONTAB_PYTHON_EXECUTABLE = '/home/django/techbikers.com/bin/python'
CRONTAB_DJANGO_MANAGE_PATH = 'manage.py'
CRONTAB_DJANGO_SETTINGS_MODULE = 'server.settings.production'

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

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE, 'webpack-stats-prod.json')
    }
}

ALLOWED_HOSTS = ['techbikers.com','spoke.techbikers.com']

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

    social_auth = config.get('social_auth')
    SOCIAL_AUTH_FACEBOOK_KEY = social_auth.get('facebook_key')
    SOCIAL_AUTH_FACEBOOK_SECRET = social_auth.get('facebook_secret')
    SOCIAL_AUTH_JUSTGIVING_KEY = social_auth.get('justgiving_key')
    SOCIAL_AUTH_JUSTGIVING_SECRET = social_auth.get('justgiving_secret')

    RAVEN_CONFIG = {
        'dsn': config.get('sentry_dsn')
    }

MEDIA_ROOT = '/home/django/techbikers.com/media'
STATIC_ROOT = '/home/django/techbikers.com/static'
