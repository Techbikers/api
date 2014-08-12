from django.conf.urls import patterns, include, url
from django.contrib.flatpages import views

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Top level pages
    url(r'^$', include('django.contrib.flatpages.urls')),

    # Riders
    url(r'^account/', include('account.urls')),
    url(r'^riders/', include('riders.urls')),
    url(r'^rides/', include('rides.urls')),
    url(r'^sales/', include('sales.urls')),

    # Payments
    # url(r"^payments/", include("payments.urls")),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # flatpages
    url(r'^(?P<url>.*/)$', views.flatpage),
)
