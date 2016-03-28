import os
from os.path import join, normpath

from base import *


DEBUG = True

ALLOWED_HOSTS = []

STATIC_ROOT = ''
MEDIA_ROOT = ''

DATABASES = {
    'default': {
         # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': (os.path.join(BASE, 'techbikers.sqlite')),
        # The following settings are not used with sqlite3:
        'USER': '',
        'PASSWORD': '',
        # Host is empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'HOST': '',
        'PORT': '',
    }
}

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE, 'webpack-stats.json')
    }
}

MANDRILL_API_KEY = ''
MANDRILL_SUBACCOUNT = ""

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'i-xhck&#!-t!m+i9%@_1$g$a=rcv1whu+awzguuz-%lv@-+t4s'
STRIPE_ENVIRONMENT = 'test'

MIDDLEWARE_CLASSES += (
#    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

INTERNAL_IPS = ('127.0.0.1',)