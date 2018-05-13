from django.conf.urls import url, include
from .views.rides import RidesList, RideDetails, RideRidersList, RideRiderDetails, RideRiderCharge, RideRiderFundraiser
from .views.riders import RidersList, RiderProfile, RiderRides
from .views.chapters import ChaptersList, ChapterDetails, ChapterMembersList
from .views.sponsors import SponsorsList, SponsorDetails
from .views.fundraisers import FundraisersList
from .views.auth import AuthenticatedUserDetails, UserDetails


auth_urls = [
    url(r'^verify', AuthenticatedUserDetails.as_view(), name='auth-verify'),
    url(r'^account', UserDetails.as_view(), name='auth-account')
]

urlpatterns = [
    url(r'^auth/', include(auth_urls)),
]
