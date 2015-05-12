import hashlib

from django.contrib.auth.models import User
from rest_framework import serializers
from server.core.models.riders import RiderProfile


class RiderSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='get_full_name', read_only=True)
    avatar = serializers.SerializerMethodField(method_name='get_gravatar_url', read_only=True)
    company = serializers.CharField(source='profile.company')
    website = serializers.URLField(source='profile.website')
    twitter = serializers.CharField(source='profile.twitter')
    biography = serializers.CharField(source='profile.biography')
    statement = serializers.CharField(source='profile.statement')
    donation_page = serializers.URLField(source='profile.donation_page')
    rides = serializers.PrimaryKeyRelatedField(source='ride_set', many=True, read_only=True)

    def get_gravatar_url(self, rider):
        return "https://www.gravatar.com/avatar/" + hashlib.md5(rider.email.lower()).hexdigest()

    def to_representation(self, instance):
        # Instantiate the superclass normally
        data = super(RiderSerializer, self).to_representation(instance)

        # Only include the email field if the user is looking up their own record
        request = self.context.get('request', None)
        if not request.user.is_authenticated() or (data.get('id', 0) != request.user.id):
            data.pop("email")

        return data

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'name', 'first_name', 'last_name', 'avatar', 'company',
                  'website', 'twitter', 'biography', 'statement', 'donation_page', 'rides')
        write_only_fields = ('password',)
        read_only_fields = ('id',)