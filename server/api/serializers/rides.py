import markdown
from rest_framework import serializers
from server.api.serializers.chapters import ChapterSerializer
from server.core.models.rides import Ride


class RideSerializer(serializers.ModelSerializer):
    chapter = ChapterSerializer()
    riders = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Ride
        fields = ('id', 'name', 'slug', 'description_html', 'start_location', 'end_location', 'start_date', 'end_date',
                  'chapter', 'rider_capacity', 'riders', 'spaces_left', 'price', 'currency', 'is_over')