import os
import json

from base import *

DEBUG = False

INSTALLED_APPS += (
    # other apps for production site
    "gunicorn",
)

CRONJOBS = [
    ('0 9 * * *', 'server.cronjobs.slack_daily_update'),
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

# Auth0 Settings
# These are public details so no security risk
JWT_AUTH['JWT_AUDIENCE'] = 'CZuJ8UsHJfF4Xbz4gukAVXC8YlQ2knUC'

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
    SOCIAL_AUTH_JUSTGIVING_KEY = social_auth.get('justgiving_key')
    SOCIAL_AUTH_JUSTGIVING_SECRET = social_auth.get('justgiving_secret')

    # Slack Bot Settings
    SLACK_CHANNEL = '#updates'
    SLACK_TOKEN = config.get('slack_bot_token')
    SLACK_BACKEND = 'django_slack.backends.UrllibBackend'

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
