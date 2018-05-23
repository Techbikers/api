from django.conf.urls import include, url
from django.views.generic.base import RedirectView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = [

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # API
    url(r'^chapters/', include('server.chapters.urls')),
    url(r'^fundraisers/', include('server.fundraisers.urls')),
    url(r'^rides/', include('server.rides.urls')),
    url(r'^riders/', include('server.riders.urls')),
    url(r'^sponsors/', include('server.sponsors.urls')),
    url(r'^tasks/', include('server.tasks.urls')),
]
