from rest_framework import generics
from rest_framework.permissions import AllowAny
from server.api.serializers.fundraisers import FundraiserSerializer
from server.models.fundraisers import Fundraiser


class FundraisersList(generics.ListAPIView):
    model = Fundraiser
    queryset = Fundraiser.objects.filter(pageStatus=True)
    serializer_class = FundraiserSerializer
    permission_classes = (AllowAny,)