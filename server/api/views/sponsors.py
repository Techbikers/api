from rest_framework import generics
from server.models.sponsors import Sponsor
from server.api.serializers.sponsors import SponsorSerializer


class SponsorsList(generics.ListAPIView):
    model = Sponsor
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer


class SponsorDetails(generics.RetrieveAPIView):
    model = Sponsor
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    lookup_field = 'id'