from django.conf.urls import include, url
from django.views.generic.base import RedirectView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = [

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # API
    url(r'^rides/', include('server.rides.urls')),
    url(r'^', include('server.api.urls')),
]
