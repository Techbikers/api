from django.conf.urls import patterns, include, url
from django.views.generic.base import RedirectView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    # Temporarily redirect from /donate
    url(r'^donate$', RedirectView.as_view(url='https://www.justgiving.com/search?q=techbikers&i=fundraiser&limit=20&type=onesearch', permanent=True)),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # API
    url(r'^api/', include('server.api.urls')),

    # Authentication Providers
    # While we have auth api endpoints for obtaining tokens to
    # login to the app, this provides endpoints for entire
    # authentication flows with external providers
    url(r'^auth/', include('server.core.auth.urls', namespace='auth')),

    # Catchall and routing is handled by the client app
    url(r'^', 'server.core.views.app'),
)
