import requests
from django.conf import settings
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from server.api.serializers.chapters import ChapterSerializer
from server.core.models.rides import Ride, RideRiders


class RideSerializer(serializers.ModelSerializer):
    chapter = ChapterSerializer()
    riders = serializers.PrimaryKeyRelatedField(source='registered_riders', many=True, read_only=True)
    fundraising = serializers.SerializerMethodField('get_event_leaderboard')

    def get_event_leaderboard(self, ride):
        if (ride.just_giving_event_id is not None):
            try:
                response = requests.get(
                    '{0}/event/{1}/leaderboard'.format(settings.JUST_GIVING_API_URL, ride.just_giving_event_id),
                    headers={
                        'x-api-key': settings.SOCIAL_AUTH_JUSTGIVING_KEY,
                        'x-application-key': settings.SOCIAL_AUTH_JUSTGIVING_SECRET,
                        'Content-Type': 'application/json'
                    })
                return response.json()
            except requests.exceptions.RequestException, e:
                return {}
        else:
            return {}

    class Meta:
        model = Ride
        fields = ('id', 'name', 'slug', 'description_html', 'start_location', 'end_location', 'start_date', 'end_date',
                  'chapter', 'rider_capacity', 'riders', 'spaces_left', 'price', 'full_cost', 'currency', 'is_over', 'fundraising')


class RideRiderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = RideRiders
        fields = ('ride', 'user', 'signup_date', 'signup_expires', 'status', 'paid', 'expired', 'payload')
        validators = [
            UniqueTogetherValidator(
                queryset=RideRiders.objects.all(),
                fields=('user', 'ride'),
                message='You have already registered for this ride.'
            )
        ]