from rest_framework import serializers
from server.core.models.chapters import Chapter


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ('id', 'name', 'public_key', 'membership_fee', 'currency')