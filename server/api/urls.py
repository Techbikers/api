from django.conf.urls import url, include
from rest_framework_jwt.views import refresh_jwt_token, obtain_jwt_token
from .views.rides import RidesList, RideDetails, RideRidersList, RideRiderDetails, RideRiderCharge, RideSponsorsList, RideRiderFundraiser
from .views.riders import RidersList, RiderProfile, RiderRides
from .views.chapters import ChaptersList, ChapterDetails, ChapterMembersList
from .views.auth import PasswordChange, PasswordReset, PasswordResetConfirm, TokenExchange
from .views.sponsors import SponsorsList, SponsorDetails
from .views.fundraisers import FundraisersList
from .views.auth import AuthenticatedUserDetails, UserDetails


auth_urls = [
    url(r'^verify', AuthenticatedUserDetails.as_view(), name='auth-verify'),
    url(r'^account', UserDetails.as_view(), name='auth-account'),
    url(r'^token/exchange', TokenExchange.as_view()),
    url(r'^token/refresh', refresh_jwt_token),
    url(r'^token', obtain_jwt_token),
    url(r'^password/change', PasswordChange.as_view(), name='password-change'),
    url(r'^password/reset/confirm', PasswordResetConfirm.as_view(), name='password_reset_confirm'),
    url(r'^password/reset', PasswordReset.as_view(), name='password-reset')
]

ride_urls = [
    url(r'^(?P<id>\d+)/riders/(?P<rider_id>\d+)/fundraiser', RideRiderFundraiser.as_view(), name='ride-rider-fundraiser'),
    url(r'^(?P<id>\d+)/riders/(?P<rider_id>\d+)/charge', RideRiderCharge.as_view(), name='ride-rider-charge'),
    url(r'^(?P<id>\d+)/riders/(?P<rider_id>\d+)', RideRiderDetails.as_view(), name='ride-rider-details'),
    url(r'^(?P<id>\d+)/riders', RideRidersList.as_view(), name='ride-riders'),
    url(r'^(?P<id>\d+)/sponsors', RideSponsorsList.as_view(), name='ride-sponsors'),
    url(r'^(?P<id>\d+)', RideDetails.as_view(), name='ride-details'),
    url(r'^$', RidesList.as_view(), name='rides-list')
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
    url(r'^rides/', include(ride_urls)),
    url(r'^riders/', include(rider_urls)),
    url(r'^chapters/', include(chapter_urls)),
    url(r'^sponsors/', include(sponsor_urls)),
    url(r'^fundraisers/', include(fundraiser_urls))
]
