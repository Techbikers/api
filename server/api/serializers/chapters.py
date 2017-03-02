from rest_framework import serializers
from server.models.chapters import Chapter


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ('id', 'name', 'description', 'public_key', 'membership_fee', 'currency')