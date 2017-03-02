from django.conf.urls import patterns, include, url
from django.views.generic.base import RedirectView

from server.views import app

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = [

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # API
    url(r'^api/', include('server.api.urls')),

    # Authentication Providers
    # While we have auth api endpoints for obtaining tokens to
    # login to the app, this provides endpoints for entire
    # authentication flows with external providers
    url(r'^auth/', include('server.auth.urls', namespace='auth')),

    # Catchall and routing is handled by the client app
    url(r'^', app)
]
