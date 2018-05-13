from rest_framework import generics

from server.sponsors.models import Sponsor
from server.sponsors.serializers import SponsorSerializer


class SponsorsList(generics.ListAPIView):
    model = Sponsor
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    filter_fields = ('rides',)


class SponsorDetails(generics.RetrieveAPIView):
    model = Sponsor
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    lookup_field = 'id'
