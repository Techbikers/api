from django.conf.urls import url, include

from server.rides.views import RidesList, RideDetails, RideRidersList, RideRiderDetails, RideRiderCharge, RideRiderFundraiser

urlpatterns = [
    url(r'^(?P<id>\d+)/riders/(?P<rider_id>\d+)/fundraiser', RideRiderFundraiser.as_view(), name='ride-rider-fundraiser'),
    url(r'^(?P<id>\d+)/riders/(?P<rider_id>\d+)/charge', RideRiderCharge.as_view(), name='ride-rider-charge'),
    url(r'^(?P<id>\d+)/riders/(?P<rider_id>\d+)', RideRiderDetails.as_view(), name='ride-rider-details'),
    url(r'^(?P<id>\d+)/riders', RideRidersList.as_view(), name='ride-riders'),
    url(r'^(?P<id>\d+)', RideDetails.as_view(), name='ride-details'),
    url(r'^$', RidesList.as_view(), name='rides-list')
]
