from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny

from server.api.permissions import IsOwnerOrReadOnly
from server.riders.serializers import RiderSerializer
from server.rides.serializers import RideSerializer
from server.rides.models import Ride


class RidersList(generics.ListCreateAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = RiderSerializer
    permission_classes = (AllowAny,)


class RiderProfile(generics.RetrieveUpdateAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = RiderSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    lookup_field = 'id'


class RiderRides(generics.ListAPIView):
    model = Ride
    serializer_class = RideSerializer

    def get_queryset(self):
        return Ride.objects.filter(riders__id=self.kwargs.get('id'))
