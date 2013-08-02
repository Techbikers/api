from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Riders
    url(r'^$', 'techbikers.views.index'),
    url(r'^riders/', include('riders.urls')),
    url(r'^rides/', include('rides.urls')),

    # Payments
    # url(r"^payments/", include("payments.urls")),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
