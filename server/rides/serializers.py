import requests
from django.conf import settings
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from server.api.serializers.chapters import ChapterSerializer
from server.riders.serializers import RiderSerializer
from server.rides.models import Ride, RideRiders


class RideSerializer(serializers.ModelSerializer):
    chapter = ChapterSerializer()
    riders = serializers.SerializerMethodField(source='get_riders', read_only=True)

    def get_riders(self, ride):
        return ride.registered_riders.values_list('id', flat=True)

    class Meta:
        model = Ride
        fields = ('id', 'name', 'slug', 'strapline', 'description_html', 'start_location', 'end_location', 'start_date', 'end_date',
                  'chapter', 'rider_capacity', 'riders', 'spaces_left', 'price', 'full_cost', 'currency', 'is_over',
                  'fundraising_total', 'fundraising_target')


class RideRiderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    signup_date = serializers.DateTimeField(required=False)

    class Meta:
        model = RideRiders
        fields = ('id', 'ride', 'user', 'signup_date', 'signup_expires', 'status', 'paid', 'expired', 'payload')
        validators = [
            UniqueTogetherValidator(
                queryset=RideRiders.objects.all(),
                fields=('user', 'ride'),
                message='You have already registered for this ride.'
            )
        ]
