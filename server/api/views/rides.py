# encoding=utf8
import stripe
import requests
import json
from rest_framework import generics, serializers
from rest_framework.exceptions import ValidationError
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
                    "Techbikers {0}: {1}".format(ride.name, request.user.email))
            except stripe.error.InvalidRequestError, e:
                raise ValidationError(e.json_body['error']['message'])
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

        # We want to make the api call first to create the
        # fundraising page with virgin money giving.
        pageShortName = slugify('techbikers {0} {1}'.format(ride.name, user.id))
        payload = {
            'charityId': settings.JUST_GIVING_CHARITY_ID,
            'eventId': ride.just_giving_event_id,
            'pageShortName': pageShortName,
            'pageTitle': "I'm doing TechBikers: Support my 260mi cycle for childhood literacy!",
            'targetAmount': '500',
            'justGivingOptIn': False,
            'charityOptIn': False,
            'charityFunded': False,
            'pageSummaryWhat': 'I am cycling from Paris to London',
            'pageSummaryWhy': 'world change starts with educated children',
            'pageStory': "<p><b>Did you know that if every child received an education, 170 million people would be lifted out of poverty?</b></p><p>In September, as the weather turns cold and wet, I will be on a bike, cycling over 200 miles from Paris to London with TechBikers to raise money for Room to Read. </p><p><b>Please support me with however much you can give.</b></p><p>Why? To support Room to Read's work on a cause I strongly believe in: providing children with an education. </p><p>Focusing on childhood literacy is one of the most effective ways to improve living standards across the globe.</p><p><b>WHERE WILL MY DONATION GO?</b></p><p>All your donations will go straight to Room to Read, who have received the coveted Four Star Rating from Charity Navigator nine(!) years in a row. About £12,000 will be used to rebuild a school in Nepal that was built in 2013 using TechBikers funds. The rest will go where the need is greatest. </p><p><b>WHAT'S TECHBIKERS?</b></p><p>Techbikers brings together the London tech startup community to help children in need by supporting literacy charity Room to Read.  Since 2012, over 120 entrepreneurs, VCs, and other tech enthusiasts have cycled 960km to raise $265,000 for this fantastic charity, and built a school, a handful of libraries, and supported the education of over 3,000 girls.</p>",
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
            auth=(serializer.initial_data.get('email'), serializer.initial_data.get('password')),
            headers = {'x-api-key': settings.JUST_GIVING_API_KEY},
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