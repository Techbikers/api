from rest_framework import generics
from rest_framework.permissions import AllowAny

from server.fundraisers.serializers import FundraiserSerializer
from server.fundraisers.models import Fundraiser


class FundraisersList(generics.ListAPIView):
    model = Fundraiser
    queryset = Fundraiser.objects.filter(pageStatus=True)
    serializer_class = FundraiserSerializer
    permission_classes = (AllowAny,)
