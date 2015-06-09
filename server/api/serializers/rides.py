import markdown
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from server.api.serializers.chapters import ChapterSerializer
from server.core.models.rides import Ride, RideRiders


class RideSerializer(serializers.ModelSerializer):
    chapter = ChapterSerializer()
    riders = serializers.PrimaryKeyRelatedField(source='registered_riders', many=True, read_only=True)

    class Meta:
        model = Ride
        fields = ('id', 'name', 'slug', 'description_html', 'start_location', 'end_location', 'start_date', 'end_date',
                  'chapter', 'rider_capacity', 'riders', 'spaces_left', 'price', 'currency', 'is_over')


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