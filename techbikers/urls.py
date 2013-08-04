from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Top level pages
    url(r'^$', 'techbikers.views.index', name="home"),
    url(r'^about/$', 'techbikers.views.about', name="about"),
    url(r'^the_ride/$', 'techbikers.views.the_ride', name="the_ride"),

    # Riders
    url(r'^riders/', include('riders.urls')),
    url(r'^rides/', include('rides.urls')),
    url(r'^charge/', include('sales.urls')),

    # Payments
    # url(r"^payments/", include("payments.urls")),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
