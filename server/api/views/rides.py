from rest_framework import generics
from django.contrib.auth.models import User
from server.core.models.rides import Ride, RideRiders
from server.api.serializers.rides import RideSerializer
from server.api.serializers.riders import RiderSerializer


class RidesList(generics.ListCreateAPIView):
    model = Ride
    queryset = Ride.objects.all()
    serializer_class = RideSerializer


class RideDetails(generics.RetrieveUpdateAPIView):
    model = Ride
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    lookup_field = 'id'


class RideRidersList(generics.ListAPIView):
    model = User
    serializer_class = RiderSerializer

    def get_queryset(self):
        return User.objects.filter(
            ride__id=self.kwargs.get('id'),
            rideriders__status=RideRiders.REGISTERED)