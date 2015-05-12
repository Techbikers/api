from django.conf.urls import patterns, url, include
from .views.rides import RidesList, RideDetails, RideRiders
from .views.riders import RidersList, RiderProfile, RiderRides
from .views.chapters import ChaptersList, ChapterDetails
from .views.auth import PasswordChange


auth_urls = patterns('',
    url(r'^/token-refresh', 'rest_framework_jwt.views.refresh_jwt_token'),
    url(r'^/token', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^/password-change', PasswordChange.as_view(), name='password-change')
)

ride_urls = patterns('',
    url(r'^/(?P<id>\d+)/riders$', RideRiders.as_view(), name='ride-riders'),
    url(r'^/(?P<id>\d+)$', RideDetails.as_view(), name='ride-details'),
    url(r'^$', RidesList.as_view(), name='rides-list')
)

rider_urls = patterns('',
    url(r'^/(?P<id>\d+)/rides$', RiderRides.as_view(), name='rider-rides'),
    url(r'^/(?P<id>\d+)$', RiderProfile.as_view(), name='rider-profile'),
    url(r'^$', RidersList.as_view(), name='riders-list')
)

chapter_urls = patterns('',
    url(r'^/(?P<id>\d+)$', ChapterDetails.as_view(), name='chapter-details'),
    url(r'^$', ChaptersList.as_view(), name='chapters-list')
)


urlpatterns = patterns('',
    url(r'^auth', include(auth_urls)),
    url(r'^rides', include(ride_urls)),
    url(r'^riders', include(rider_urls)),
    url(r'^chapters', include(chapter_urls))
)