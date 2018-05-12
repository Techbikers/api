from django.conf.urls import url, include

from server.fundraisers.views import FundraisersList


urlpatterns = [
    url(r'^$', FundraisersList.as_view(), name='fundraiser-list')
]
