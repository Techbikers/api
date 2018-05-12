from django.conf.urls import url, include

from server.riders.views import RidersList, RiderProfile, RiderRides


urlpatterns = [
    url(r'^(?P<id>\d+)/rides', RiderRides.as_view(), name='rider-rides'),
    url(r'^(?P<id>\d+)', RiderProfile.as_view(), name='rider-profile'),
    url(r'^$', RidersList.as_view(), name='riders-list')
]
