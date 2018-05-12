from rest_framework import serializers

from server.chapters.models import Chapter


class ChapterSerializer(serializers.ModelSerializer):
    rides = serializers.SerializerMethodField(source='get_rides', read_only=True)


    def get_rides(self, chapter):
        return chapter.ride_set.order_by('-start_date').values_list('id', flat=True)

    class Meta:
        model = Chapter
        fields = ('id', 'name', 'description', 'public_key', 'membership_fee', 'currency', 'rides')
