# encoding=utf8
import stripe
import requests
import json
from rest_framework import generics, serializers
from rest_framework.exceptions import ValidationError
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.conf import settings
from server.core.models.rides import Ride, RideRiders
from server.core.models.sales import Sale
from server.core.models.sponsors import Sponsor
from server.core.models.fundraisers import Fundraiser
from server.api.serializers.rides import RideSerializer, RideRiderSerializer
from server.api.serializers.riders import RiderSerializer
from server.api.serializers.sponsors import SponsorSerializer
from server.api.serializers.fundraisers import FundraiserSerializer
from server.api.permissions import IsOwner, RiderIsAccepted


class RidesList(generics.ListCreateAPIView):
    model = Ride
    queryset = Ride.objects.all()
    serializer_class = RideSerializer


class RideDetails(generics.RetrieveUpdateAPIView):
    model = Ride
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    lookup_field = 'id'


class RideRidersList(generics.ListCreateAPIView):
    def get_queryset(self):
        return User.objects.filter(
            ride__id=self.kwargs.get('id'),
            rideriders__status=RideRiders.REGISTERED)

    def get_serializer_class(self):
        """
        We want to return a list of the riders that are on the ride when the action
        is 'list'. When the action is 'create' we want to try and create a new
        RideRider object for the current user on the current ride so use the
        RideRiderSerializer instead.
        """
        if self.request.method == 'POST':
            return RideRiderSerializer
        return RiderSerializer

    def perform_create(self, serializer):
        ride = Ride.objects.get(id=self.kwargs.get('id'))
        user = self.request.user

        serializer.save(
            user=user,
            ride=ride,
            paid=False,
            status=RideRiders.PENDING)


class RideRiderDetails(generics.RetrieveAPIView):
    model = RideRiders
    queryset = RideRiders.objects.all()
    serializer_class = RideRiderSerializer
    permission_classes = (IsOwner,)

    def get_object(self):
        queryset = self.get_queryset()
        filter = {
            'ride__id': self.kwargs.get('id'),
            'user__id': self.kwargs.get('rider_id')
        }
        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj


class RideRiderCharge(generics.UpdateAPIView):
    model = RideRiders
    serializer_class = RideRiderSerializer
    permission_classes = (IsOwner, RiderIsAccepted)
    lookup_field = 'user__id'
    lookup_url_kwarg = 'rider_id'

    def get_queryset(self):
        return RideRiders.objects.filter(ride__id=self.kwargs.get('id'))

    def perform_update(self, serializer):
        """
        Charge the user for the ride fee and then update the status of
        their RideRider entry. The current status must be 'accepted'
        and the logged in user must be the owner of the record.
        """
        request = self.request
        ride = Ride.objects.get(id=self.kwargs.get('id'))
        amount = request.data.get('amount')
        if amount is None:
            amount = ride.price
        else:
            amount = float(amount)

        if amount < ride.price:
            raise ValidationError("The amount can't be less than the price of the ride.")

        if ride.price > 0:
            try:
                sale = Sale.charge(
                    request.data.get('token'),
                    ride.chapter.private_key,
                    int(amount * 100),
                    ride.currency,
                    "Techbikers {0}: {1}".format(ride.name, request.user.email),
                    request.user.email)
            except stripe.error.CardError, e:
                raise ValidationError(e.json_body['error'])
            sale.rider_id = request.user.id
            sale.save()

            serializer.save(status=RideRiders.REGISTERED, paid=True, sale=sale)
        else:
            serializer.save(status=RideRiders.REGISTERED)


class RideRiderFundraiser(generics.RetrieveAPIView, generics.CreateAPIView):
    model = Fundraiser
    serializer_class = FundraiserSerializer
    lookup_field = 'user__id'
    lookup_url_kwarg = 'rider_id'

    def get_queryset(self):
        return Fundraiser.objects.filter(ride__id=self.kwargs.get('id'))

    def perform_create(self, serializer):
        ride = Ride.objects.get(id=self.kwargs.get('id'))
        user = self.request.user
        social_user = user.social_auth.filter(provider='justgiving')[0]

        # We want to make the api call first to create the
        # fundraising page with virgin money giving.
        pageShortName = slugify('techbikers {0} {1}'.format(ride.name, user.id))
        pageStory = render_to_string('justgiving_page_story.html', {'ride': ride})
        payload = {
            'charityId': settings.JUST_GIVING_CHARITY_ID,
            'eventId': ride.just_giving_event_id,
            'pageShortName': pageShortName,
            'pageTitle': 'I\'m doing TechBikers {0}: Support my 300km cycle for childhood literacy!'.format(ride.chapter.name),
            'targetAmount': int(ride.fundraising_target),
            'currency': ride.currency.upper(),
            'justGivingOptIn': False,
            'charityOptIn': False,
            'charityFunded': False,
            'pageSummaryWhat': 'I am cycling from {0} to {1}'.format(ride.start_location, ride.end_location),
            'pageSummaryWhy': 'world change starts with educated children',
            'pageStory': pageStory,
            'theme': {
                'pageBackground': '#FFFFFF',
                'buttonsThermometerFill': '#4494C7',
                'linesThermometerBackground': '#76C15A'
            },
            'images': [
                {
                    'caption': '',
                    'url': 'https://techbikers.com/static/img/techbikers_group.jpg',
                    'isDefault': True
                },
                {
                    'caption': '',
                    'url': 'https://techbikers.com/static/img/classroom.jpg',
                    'isDefault': False
                }
            ]
        }
        response = requests.put('{0}/fundraising/pages'.format(settings.JUST_GIVING_API_URL),
            headers = {
                'x-api-key': settings.SOCIAL_AUTH_JUSTGIVING_KEY,
                'x-application-key': settings.SOCIAL_AUTH_JUSTGIVING_SECRET,
                'Authorization': 'Bearer {0}'.format(social_user.extra_data['access_token'])},
            json=payload)
        response.raise_for_status()

        # Now let's create the fundraising record with the returned info
        response_json = response.json()

        serializer.save(
            user=user,
            ride=ride,
            pageUrl='http://www.justgiving.com/{0}'.format(pageShortName),
            pageId=response_json['pageId'],
            signOnUrl=response_json['signOnUrl'])


class RideSponsorsList(generics.ListAPIView):
    model = Sponsor
    serializer_class = SponsorSerializer

    def get_queryset(self):
        return Sponsor.objects.filter(rides__id=self.kwargs.get('id'))
