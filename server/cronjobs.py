import hashlib
import requests
import json
from datetime import datetime
from django.conf import settings
from django.contrib.auth.models import User
from django_slack import slack_message
from server.models.fundraisers import Fundraiser
from server.models.rides import Ride, RideRiders


def slack_daily_update():
    """
    Posts to the Techbikers Slack with a daily update on the current rides
    """
    attachments = []
    rides = Ride.objects.filter(end_date__gte=datetime.now().date())

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

    slack_message('slack/daily_update.slack', { 'number_rides': rides.count() }, attachments)

def update_fundraisers():
    fundraisers = Fundraiser.objects.filter(pageStatus=True)

    # Iterate over the objects and update them
    for fundraiser in fundraisers:
        fundraiser.fetch_details()


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


def batch_update_mailchimp_list():
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

    return response
