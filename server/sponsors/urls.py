from django.conf.urls import url, include

from server.sponsors.views import SponsorsList, SponsorDetails


urlpatterns = [
    url(r'^(?P<id>\d+)', SponsorDetails.as_view(), name='sponsor-details'),
    url(r'^$', SponsorsList.as_view(), name='sponsor-list')
]
