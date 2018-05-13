from rest_framework import serializers

from server.sponsors.models import Sponsor, RideSponsor


class RideSponsorSerializer(serializers.ModelSerializer):
  class Meta:
    model = RideSponsor
    fields = ('sponsor', 'ride', 'sponsor_level')


class SponsorSerializer(serializers.ModelSerializer):
    rides = RideSponsorSerializer(source='ridesponsor_set', many=True)

    class Meta:
        model = Sponsor
        fields = ('id', 'organisation', 'description', 'logo', 'website', 'twitter', 'facebook', 'rides')
