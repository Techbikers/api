from rest_framework import serializers
from server.core.models.fundraisers import Fundraiser


class FundraiserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fundraiser
        fields = ('user', 'ride', 'pageId', 'pageUrl', 'signOnUrl')
        read_only_fields = ('pageUrl', 'pageId')