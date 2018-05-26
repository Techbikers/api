import os
import sys
from server.auth.utils import get_auth0_public_key

ADMINS = (
    ('Michael Willmott', 'michael@techbikers.com')
)

MANAGERS = ADMINS

SERVER_EMAIL = "spoke@techbikers.com"

BASE = os.path.abspath(os.path.dirname(__name__))

# Just Giving API Details
JUSTGIVING_CHARITY_ID = '181334' # Room to Read Charity ID

REST_FRAMEWORK = {
    'COERCE_DECIMAL_TO_STRING': False,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}

# Auth0 API
AUTH0_API_URL = 'https://techbikers.eu.auth0.com/api/v2'
AUTH0_TOKEN_URL = 'https://techbikers.eu.auth0.com/oauth/token'
AUTH0_CLIENT_AUDIENCE = 'https://techbikers.eu.auth0.com/api/v2/'
# URL for the public certificate used to validate tokens
AUTH0_PUBLIC_CERTIFICATE_URL = 'https://techbikers.eu.auth0.com/pem'

JWT_AUTH = {
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
    'JWT_ALGORITHM': 'RS256',
    'JWT_VERIFY': True,
    'JWT_PUBLIC_KEY': get_auth0_public_key(AUTH0_PUBLIC_CERTIFICATE_URL),
    'JWT_PAYLOAD_GET_USERNAME_HANDLER': 'server.auth.handlers.get_auth0_username_handler',
}

# Email Backend
EMAIL_BACKEND = 'sgbackend.SendGridBackend'
DEFAULT_FROM_EMAIL = 'hello@techbikers.com'

# Slack Bot Settings
SLACK_ICON_URL = 'https://techbikers.com/static/img/techbikers_bot.png'
SLACK_USERNAME = 'Techbikers Mechanic'


# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Europe/London'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-gb'

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# URL prefix for static & media files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'
MEDIA_URL = '/media/'

# Additional locations of static files
STATICFILES_DIRS = (
    (os.path.join(BASE, 'public'),)
)

# Caching Settings
# We don't use this much and don't currently cache pages/api responses so
# this doesn't need to be anything better than local-memory caching
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': 80000
    }
}

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# Templates configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE, 'server', 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ]
        },
    }
]

CODEMIRROR_PATH = 'js/codemirror'

ROOT_URLCONF = 'server.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'server.wsgi.application'

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'raven.contrib.django.raven_compat',
    'django.contrib.admin',
    'rest_framework',
    'rest_framework_jwt',
    'server.api',
    'server.chapters',
    'server.fundraisers',
    'server.riders',
    'server.rides',
    'server.sales',
    'server.sponsors',
    'codemirror',
    'django_slack',
    'corsheaders'
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'corsheaders.middleware.CorsMiddleware',
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'WARNING',
        'handlers': ['sentry'],
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s%(message)s'
        },
    },
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'INFO',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'stream': sys.stdout,
        },
        'sentry': {
            'level': 'WARNING',
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
            'filters': ['require_debug_false'],
            'tags': {'custom-tag': 'x'},
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'sentry'],
        },
        'django.request': {
            'handlers': ['console', 'sentry'],
        },
        'cronjobs': {
            'handlers': ['console', 'sentry'],
        },
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['console', 'sentry'],
            'propagate': False,
        }
    }
}

CORS_ORIGIN_WHITELIST = (
    'localhost:8000',
    'techbikers.local',
    'techbikers.local:8000'
)
