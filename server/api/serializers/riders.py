import hashlib

from django.contrib.auth.models import User
from rest_framework import serializers
from server.core.models.rides import RideRiders


class RiderSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='get_full_name', read_only=True)
    avatar = serializers.SerializerMethodField(method_name='get_gravatar_url', read_only=True)
    company = serializers.CharField(source='profile.company', required=False, allow_blank=True)
    website = serializers.URLField(source='profile.website', required=False, allow_blank=True)
    twitter = serializers.CharField(source='profile.twitter', required=False, allow_blank=True)
    biography = serializers.CharField(source='profile.biography', required=False, allow_blank=True)
    statement = serializers.CharField(source='profile.statement', required=False, allow_blank=True)
    donation_page = serializers.URLField(source='profile.donation_page', required=False, allow_blank=True)
    rides = serializers.SerializerMethodField(source='get_rides', read_only=True)
    is_member = serializers.BooleanField(source='profile.is_member', read_only=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value):
            raise serializers.ValidationError("This email address is already in use.")
        return value

    def get_gravatar_url(self, rider):
        return "https://www.gravatar.com/avatar/" + hashlib.md5(rider.email.lower()).hexdigest()

    def get_rides(self, rider):
        return rider.ride_set.filter(rideriders__status=RideRiders.REGISTERED).values_list('id', flat=True)

    def to_representation(self, instance):
        # Instantiate the superclass normally
        data = super(RiderSerializer, self).to_representation(instance)

        # Only include the email field if the user is looking up their own record
        request = self.context.get('request', None)
        if not request.user.is_authenticated() or (data.get('id', 0) != request.user.id):
            data.pop("email")

        return data

    def create(self, validated_data):
        email = validated_data.get("email", None)
        password = validated_data.get("password", None)
        profile = validated_data.get("profile", {})
        # Create the new user
        new_user = User.objects.create_user(email, email, password)
        new_user.first_name = validated_data.get("first_name", None)
        new_user.last_name = validated_data.get("last_name", None)
        new_user.save()

        new_user.profile.company = profile.get("company", None)
        new_user.profile.website = profile.get("website", None)
        new_user.profile.twitter = profile.get("twitter", None)
        new_user.profile.biography = profile.get("biography", None)
        new_user.profile.statement = profile.get("statement", None)
        new_user.profile.donation_page = profile.get("donation_page", None)
        new_user.profile.save()

        return new_user

    def update(self, instance, validated_data):
        email = validated_data.get("email", instance.email)
        profile = validated_data.get("profile", {})
        instance.username = email
        instance.email = email
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.save()

        instance.profile.company = profile.get("company", instance.profile.company)
        instance.profile.website = profile.get("website", instance.profile.website)
        instance.profile.twitter = profile.get("twitter", instance.profile.twitter)
        instance.profile.biography = profile.get("biography", instance.profile.biography)
        instance.profile.statement = profile.get("statement", instance.profile.statement)
        instance.profile.donation_page = profile.get("donation_page", instance.profile.donation_page)
        instance.profile.save()

        return instance

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'name', 'first_name', 'last_name', 'avatar', 'company',
                  'website', 'twitter', 'biography', 'statement', 'donation_page', 'is_member', 'rides')
        write_only_fields = ('password',)
        read_only_fields = ('id',)