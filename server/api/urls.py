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

rider_urls = [
    url(r'^(?P<id>\d+)/rides', RiderRides.as_view(), name='rider-rides'),
    url(r'^(?P<id>\d+)', RiderProfile.as_view(), name='rider-profile'),
    url(r'^$', RidersList.as_view(), name='riders-list')
]

chapter_urls = [
    url(r'^(?P<id>\d+)/members', ChapterMembersList.as_view(), name='chapter-members'),
    url(r'^(?P<id>\d+)', ChapterDetails.as_view(), name='chapter-details'),
    url(r'^$', ChaptersList.as_view(), name='chapters-list')
]

sponsor_urls = [
    url(r'^(?P<id>\d+)', SponsorDetails.as_view(), name='sponsor-details'),
    url(r'^$', SponsorsList.as_view(), name='sponsor-list')
]

fundraiser_urls = [
    url(r'^$', FundraisersList.as_view(), name='fundraiser-list')
]

urlpatterns = [
    url(r'^auth/', include(auth_urls)),
    url(r'^riders/', include(rider_urls)),
    url(r'^chapters/', include(chapter_urls)),
    url(r'^sponsors/', include(sponsor_urls)),
    url(r'^fundraisers/', include(fundraiser_urls))
]
