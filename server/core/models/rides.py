import markdown, jsonfield
from datetime import datetime, timedelta
from django.db import models
from django.utils.functional import  cached_property
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context

from server.core.models.chapters import Chapter
from server.core.models.sales import Sale


class Ride(models.Model):
    name           = models.CharField(max_length = '255')
    slug           = models.CharField(max_length = '255', unique = True)
    description    = models.TextField(blank = True)
    start_location = models.CharField(max_length = '255')
    end_location   = models.CharField(max_length = '255')
    start_date     = models.DateField()
    end_date       = models.DateField()

    # Does this ride require pre-registration before signing up?
    preregistration_required = models.BooleanField(default=False)

    # Details to sign up riders
    rider_capacity = models.IntegerField(default = 0)
    price          = models.DecimalField(default = 0.00, max_digits = 6, decimal_places = 2)
    full_cost      = models.DecimalField(default=0.00, max_digits=6, decimal_places=2)
    currency       = models.CharField(max_length = 3, choices=(('gbp', 'GBP'), ('usd', 'USD'), ('eur', 'EUR')), default = 'gbp')
    terms_and_conditions = models.TextField(null=True, blank = True, default='')

    # Fundraising details

    def get_fundraising_total(self, include_giftaid = True):
        """Calculate the total amount raised for this ride"""
        totals = self.fundraiser_set.aggregate(total=models.Sum('totalRaised'), giftaid=models.Sum('giftAid'))
        if include_giftaid:
            return (totals['total'] or 0) + (totals['giftaid'] or 0)
        else:
            return totals['total'] or 0

    fundraising_total    = cached_property(get_fundraising_total, name='fundraising_total')
    fundraising_target   = models.DecimalField(default=500.00, max_digits=6, decimal_places=2)
    just_giving_event_id = models.IntegerField(null=True, blank=True)

    # Linked Entities
    chapter        = models.ForeignKey(Chapter, null=True, blank=True)
    riders         = models.ManyToManyField(User, through='RideRiders', blank=True)

    # Calculated properties (not stored in the db)
    @property
    def registered_riders(self):
        return self.riders.filter(rideriders__status=RideRiders.REGISTERED)

    @property
    def description_html(self):
        return markdown.markdown(self.description, safe_mode='escape')

    @property
    def spaces_left(self):
        return max(0, self.rider_capacity - self.registered_riders.count())

    # Determine is the ride is over
    @property
    def is_over(self):
        return self.end_date <= datetime.now().date()

    def __unicode__(self):
        return self.name

    class Meta:
        db_table    = 'rides'


class RideRiders(models.Model):
    user = models.ForeignKey(User)
    ride = models.ForeignKey(Ride)

    # Define the different states this record can be in
    PENDING = 'PEN'     # waiting to be accepted onto the ride
    ACCEPTED = 'ACC'    # accepted and waiting to complete registration
    REGISTERED = 'REG'  # fully registered and on the ride
    REJECTED = 'REJ'    # rejected from the ride (usually due to capacity issues)
    STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (REGISTERED, 'Registered'),
        (REJECTED, 'Rejected'),
    )

    # Status of the registration
    status = models.CharField(max_length=3, choices=STATUS_CHOICES, default=PENDING)
    # When they signed up for the ride
    signup_date = models.DateField(auto_now_add=True)
    # When their opportunity to complete registration expires (optional)
    signup_expires = models.DateField(blank=True, null=True)
    # Payload contains any other information we might have asked the user for during registration
    payload = jsonfield.JSONField()
    # Whether they have paid for the ride
    paid = models.BooleanField()
    # If they paid, link to the sale transaction record
    sale = models.ForeignKey(Sale, blank=True, null=True)

    @property
    def owner(self):
        return self.user

    @property
    def expired(self):
        return self.signup_expires is not None and datetime.now().date() > self.signup_expires

    def send_invite(self):
        """
        Send invite email and update record
        This sends out an email to the user, updates their registration status from
        pending to accepted and adds an expiry date to the registration.
        """
        if self.status == self.PENDING:
            # Update the registration record
            self.signup_expires = datetime.date(datetime.now() + timedelta(days=7))
            self.status = self.ACCEPTED

            # Generate & send the email
            context = Context({'user': self.user, 'ride': self.ride, 'invite_expires': self.signup_expires})
            msg = EmailMultiAlternatives(
                'Your Techbikers Invite!',
                get_template('email/ride_invite.txt').render(context),
                'TechBikers <hello@techbikers.com>',
                [self.user.email])
            msg.attach_alternative(get_template('email/ride_invite.html').render(context), "text/html")
            msg.send()

            return self.save()

    class Meta:
        db_table = 'rides_riders'
        unique_together = ('user', 'ride')
