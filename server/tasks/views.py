import hashlib
import requests
import json
import logging
from datetime import datetime
from django.conf import settings
from django.contrib.auth.models import User
from django_slack import slack_message
from rest_framework.decorators import api_view
from rest_framework.response import Response

from server.fundraisers.models import Fundraiser
from server.rides.models import Ride, RideRiders


logger = logging.getLogger("cronjobs")

@api_view()
def daily_slack_update(request):
    """
    Posts to the Techbikers Slack with a daily update on the current rides
    """
    attachments = []
    rides = Ride.objects.filter(end_date__gte=datetime.now().date())

    # If we have some current or upcoming rides, bundle together the
    # stats for each one ready to send to Slack
    if rides.count() > 0:
        for ride in rides:
            attachment = {
                'color': 'good',
                'title': ride.name,
                'title_link': 'https://techbikers.com/rides/{0}/{1}'.format(ride.id, ride.slug),
                'fields': [{
                    'title': 'Rider Registrations',
                    'value': ':white_check_mark: {0} registered, :envelope: {1} invited, :clock1: {2} pending'.format(
                        ride.registered_riders.count(),
                        ride.invited_riders.count(),
                        ride.pending_riders.count()
                    ),
                    'short': False
                }, {
                    'title': 'Fundraising Total',
                    'value': ':moneybag: {0} {1}'.format(ride.currency.upper(), ride.fundraising_total),
                    'short': False
                }]
            }
            attachments.append(attachment)

        # Post the update to Slack
        slack_message('slack/daily_update.slack', { 'number_rides': rides.count() }, attachments)

        # Return all good
        return Response({'message': 'success'})


@api_view()
def update_fundraisers(request):
    """
    Gets the latest fundraising stats for each ride by calling the JustGiving API
    to get the event fundraisers (using the event ID for each ride) and then
    updating each corresponding fundraiser.

    Note: there is a function on the Fundraiser model itself that will update an
    individual record by calling the Just Giving API. If we were to use this then
    we'd end up calling the Just Giving API a lot more than by bulk fetching
    fundraiser pages by event (ride).
    """

    # Get all the rides that have an event id
    rides = Ride.objects.filter(just_giving_event_id__isnull=False)

    for ride in rides:
        # Fetch the event pages from Just Giving
        response = requests.get(
            '{0}/event/{1}/pages?pageSize=100'.format(settings.JUSTGIVING_API_URL, ride.just_giving_event_id),
            headers={
                'x-api-key': settings.JUSTGIVING_API_KEY,
                'x-application-key': settings.JUSTGIVING_API_SECRET,
                'Content-Type': 'application/json'})
        response_json = response.json()

        # Update the fundraisers
        for page in response_json.get("fundraisingPages", []):
            # If the page status is "Cancelled" then we can ignore this page. It's
            # usually because someone went and created their own page and then
            # cancelled the automatcally created one.
            if page.get("pageStatus") == "Cancelled":
                logger.info("Cancelled fundraising page received and ignored")
                continue

            try:
                # Get the associated fundraiser object
                fundraiser = Fundraiser.objects.get(pageId=page.get("pageId"))

                # Update the model with the results
                fundraiser.pageStatus = page.get("pageStatus", "Active") == "Active"
                fundraiser.currency = page.get("currencyCode", fundraiser.currency)
                fundraiser.fundraisingTarget = page.get("targetAmount", fundraiser.fundraisingTarget)
                fundraiser.totalRaisedOffline = page.get("offlineDonations", fundraiser.totalRaisedOffline)
                fundraiser.totalRaisedOnline = page.get("totalRaisedOnline", fundraiser.totalRaisedOnline)
                fundraiser.totalRaisedSms = page.get("totalRaisedSms", fundraiser.totalRaisedSms)
                fundraiser.totalRaised = page.get("raisedAmount", fundraiser.totalRaised)
                fundraiser.giftAid = page.get("giftAidPlusSupplement", fundraiser.giftAid)

                # Save
                fundraiser.save()
            except Fundraiser.DoesNotExist:
                # We don't have a local record for this fundraising page
                logger.warning('Unexpected event page received', exc_info=True, extra={ 'eventPage': page })

    # Now update pages that were manually created (the above won't do it as they
    # aren't linked to an event). This is inefficient as it calls the Just Giving
    # API for each individual fundraiser; there shouldn't be many of these pages
    # though
    manualFundraisers = Fundraiser.objects.filter(manuallyCreated=True, pageStatus=True)

    for fundraiser in manualFundraisers:
        fundraiser.fetch_details()

    # Return all good
    return Response({'message': 'success'})


def put_mailchimp_member_operation(user):
    # The hash of their email is used to identify them in Mailchimp
    email_hash = hashlib.md5(user.email).hexdigest()

    # Get their current or last fundraising total
    fundraising_total = 0
    fundraisers = user.fundraiser_set
    if fundraisers.count() > 0:
        fundraising_total = int(fundraisers.last().totalRaised)

    # Simple merge field details for user
    merge_fields = {
        'FNAME': user.first_name or '',
        'LNAME': user.last_name or '',
        'COMPANY': user.profile.company or '',
        'TWITTER': user.profile.twitter or '',
        'FTOTAL': fundraising_total
    }

    # Which groups is the user in
    interests = {}

    for registration in user.rideriders_set.filter(status=RideRiders.REGISTERED):
        interests[registration.ride.mailchimp_group_id] = True

    # Now form the main request
    operation = {
        'method': 'PUT',
        'path': 'lists/{0}/members/{1}'.format(settings.MAILCHIMP_CORE_LIST_ID, email_hash),
        'body': json.dumps({
            'email_address': user.email,
            'status_if_new': 'subscribed',
            'merge_fields': merge_fields,
            'interests': interests
        })
    }

    return operation

@api_view()
def update_mailchimp_list(request):
    users = User.objects.all()
    batch_operations = []

    # Iterate over every user and update their Mailchimp subscription
    for user in users:
        operation = put_mailchimp_member_operation(user)
        batch_operations.append(operation)

    # Now send off the batch job to Mailchimp
    response = requests.post(
        '{0}/batches'.format(settings.MAILCHIMP_API_URL),
        auth=('techbikers', settings.MAILCHIMP_API_KEY),
        data=json.dumps({'operations': batch_operations})
    )

    return Response({'message': 'success'})
