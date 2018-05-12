from rest_framework import serializers

from server.fundraisers.models import Fundraiser


class FundraiserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fundraiser
        fields = ('id', 'user', 'ride', 'pageId', 'pageUrl', 'signOnUrl', 'pageStatus', 'currency', 'fundraisingTarget',
                  'totalRaisedOffline', 'totalRaisedOnline', 'totalRaisedSms', 'totalRaised', 'giftAid')
        read_only_fields = ('pageUrl', 'pageId')
