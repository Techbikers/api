from django import forms
from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.core import urlresolvers
from codemirror import CodeMirrorTextarea

from server.riders.models import RiderProfile
from server.rides.models import Ride, RideRiders
from server.chapters.models import Chapter
from server.sales.models import Sale
from server.sponsors.models import Sponsor, RideSponsor
from server.fundraisers.models import Fundraiser


# USER ADMIN
# ----------

admin.site.unregister(User)


@admin.register(User)
class RiderAdmin(UserAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name')
    ordering = ['id']




# USER PROFILE ADMIN
# ------------------

@admin.register(RiderProfile)
class RiderProfileAdmin(admin.ModelAdmin):
    ordering = ['user']
    readonly_fields = ('user_link', 'donation_page')
    fields = ('user_link', 'company', 'website', 'twitter', 'biography', 'statement', 'donation_page')
    list_display = ('user', 'company', 'twitter')
    list_filter = ('company',)

    def user_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.user.id,))
        return '<a href="%s">%s %s</a>' % (change_url, obj.user.first_name, obj.user.last_name)
    user_link.short_description = 'User'
    user_link.allow_tags = True




# RIDE ADMIN
# ----------
# This includes everything we need to display ride riders inline
# as well as the ride details. It is broken up into tabs.

class RiderInline(admin.TabularInline):
    model = RideRiders
    can_delete = False
    suit_classes = 'suit-tab suit-tab-riders'
    verbose_name_plural = ''

    def has_add_permission(self, request):
        return False

    def get_readonly_fields(self, request, obj=None):
        result = list(set(
                [field.name for field in self.opts.local_fields] +
                [field.name for field in self.opts.local_many_to_many]
            ))
        result.remove('id')
        return result


@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    inlines = (RiderInline,)
    ordering = ['-start_date']
    list_display = ('name', 'start_date', 'end_date', 'price', 'currency', 'rider_capacity', 'spaces_left')
    list_filter = ('start_date',)
    formfield_overrides = {
        models.TextField: {'widget': CodeMirrorTextarea(mode='markdown', config={'lineWrapping': True, 'lineNumbers': False})}
    }
    fieldsets = [
        (None, {
            'classes': ('suit-tab', 'suit-tab-details',),
            'fields': ['name', 'slug', 'start_location', 'end_location', 'start_date', 'end_date', 'rider_capacity', 'preregistration_required',
                       'price', 'full_cost', 'currency', 'chapter', 'fundraising_target', 'just_giving_event_id', 'mailchimp_group_id',]
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-description',),
            'fields': ['strapline', 'description',]}),
        (None, {
            'classes': ('suit-tab', 'suit-tab-terms',),
            'fields': ['terms_and_conditions']}),
        (None, {
            'classes': ('suit-tab', 'suit-tab-riders',),
            'fields': []}),
    ]
    suit_form_tabs = (('details', 'Details'), ('description', 'Description'), ('terms', 'Terms & Conditions'), ('riders', 'Riders'))




# RIDER ADMIN
# -----------
# Admin for ride riders as well as custom actions for inviting
# riders to join a ride and sorting functions.


@admin.register(RideRiders)
class RideRidersAdmin(admin.ModelAdmin):
    list_display = ('view_edit', 'ride_link', 'user_link', 'user', 'status', 'paid', '_has_fundraiser', 'signup_date')
    list_filter = ('ride__name', 'status')
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('user_link', 'ride_link', 'sale_link', 'signup_date', 'fundraiser_link')
    fields = ('user_link', 'user', 'ride_link', 'ride', 'signup_date', 'signup_expires', 'status', 'paid', 'sale_link', 'fundraiser_link', 'payload')
    actions = ['invite_rider']

    def _has_fundraiser(self, instance):
        return instance.has_fundraiser
    _has_fundraiser.boolean = True
    _has_fundraiser.short_description = "Fundraiser"

    def invite_rider(self, request, queryset):
        for obj in queryset:
            obj.send_invite()
        self.message_user(request, "Invites sent")
    invite_rider.short_description = "Send invites to selected riders"

    def view_edit(self, obj):
        return 'View / Edit'
    view_edit.short_description = ""

    def user_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.user.id,))
        return '<a href="%s">%s %s</a>' % (change_url, obj.user.first_name, obj.user.last_name)
    user_link.short_description = 'User'
    user_link.allow_tags = True

    def ride_link(self, obj):
        change_url = urlresolvers.reverse('admin:server_ride_change', args=(obj.ride.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.ride.name)
    ride_link.short_description = 'Ride'
    ride_link.allow_tags = True

    def sale_link(self, obj):
        change_url = urlresolvers.reverse('admin:server_sale_change', args=(obj.sale.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.sale.charge_id)
    sale_link.short_description = 'Sale'
    sale_link.allow_tags = True

    def fundraiser_link(self, obj):
        change_url = urlresolvers.reverse('admin:server_fundraiser_change', args=(obj.fundraiser.id,))
        return '%s %s (<a href="%s">View/Edit Fundraiser</a>)' % (obj.fundraiser.currency, obj.fundraiser.totalRaised, change_url)
    fundraiser_link.short_description = 'Fundraiser'
    fundraiser_link.allow_tags = True




# FUNDRAISING ADMIN
# -----------
# Admin for rider fundraisers


@admin.register(Fundraiser)
class FundraisersAdmin(admin.ModelAdmin):
    list_display = ('view_edit', 'ride_link', 'user_link', 'pageStatus', 'currency', 'totalRaised', 'formatted_progress')
    list_filter = ('ride__name', 'pageStatus')
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('user_link', 'ride_link', 'formatted_progress')
    fields = ('user_link', 'user', 'ride_link', 'ride', 'pageStatus', 'manuallyCreated', 'pageId', 'pageUrl', 'currency',
                'fundraisingTarget', 'totalRaisedOffline', 'totalRaisedOnline', 'totalRaisedSms', 'totalRaised', 'giftAid')
    actions = ['update_fundraisers']

    def update_fundraisers(self, request, queryset):
        for obj in queryset:
            obj.fetch_details()
        self.message_user(request, "Updates Done")
    update_fundraisers.short_description = "Update fundraisers with Just Giving results"

    def formatted_progress(self, obj):
        return format(obj.progress, ".0%")
    formatted_progress.short_description = 'Progress'

    def view_edit(self, obj):
        return 'View / Edit'
    view_edit.short_description = ""

    def user_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.user.id,))
        return '<a href="%s">%s %s</a>' % (change_url, obj.user.first_name, obj.user.last_name)
    user_link.short_description = 'User'
    user_link.allow_tags = True

    def ride_link(self, obj):
        change_url = urlresolvers.reverse('admin:server_ride_change', args=(obj.ride.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.ride.name)
    ride_link.short_description = 'Ride'
    ride_link.allow_tags = True




# CHAPTER ADMIN
# -------------

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    ordering = ['name']
    list_display = ('name',)




# SALES ADMIN
# -----------

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    ordering = ['-sale_date']
    list_display = ('view_edit', 'sale_date', 'rider_link', 'amount', 'currency', 'livemode', 'charge_link')
    list_filter = ('sale_date',)
    search_fields = ('rider__first_name', 'rider__last_name', 'rider__email')
    readonly_fields = ('sale_date', 'charge_link', 'card', 'amount', 'currency', 'livemode', 'rider_link')
    fields = ('sale_date', 'charge_link', 'card', 'amount', 'currency', 'livemode', 'rider_link')

    def view_edit(self, obj):
        return 'View / Edit'
    view_edit.short_description = ''

    def rider_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.rider.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.rider.email)
    rider_link.short_description = 'Rider'
    rider_link.allow_tags = True

    def charge_link(self, obj):
        test_link = "" if obj.livemode else "test/"
        return '<a target="_blank" href="https://dashboard.stripe.com/%spayments/%s">%s</a>' % (test_link, obj.charge_id, obj.charge_id)
    charge_link.short_description = 'Stripe Charge'
    charge_link.allow_tags = True


# SPONSOR ADMIN
# ----------

@admin.register(Sponsor)
class SponsorAdmin(admin.ModelAdmin):
    list_display = ('organisation',)

@admin.register(RideSponsor)
class RideSponsorAdmin(admin.ModelAdmin):
    list_display = ('view_edit', 'ride_link', 'sponsor_link', 'sponsor_level')
    list_filter = ('ride__name',)

    def view_edit(self, obj):
        return 'View / Edit'
    view_edit.short_description = ""

    def ride_link(self, obj):
        change_url = urlresolvers.reverse('admin:server_ride_change', args=(obj.ride.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.ride.name)
    ride_link.short_description = 'Ride'
    ride_link.allow_tags = True

    def sponsor_link(self, obj):
        change_url = urlresolvers.reverse('admin:server_sponsor_change', args=(obj.sponsor.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.sponsor.organisation)
    sponsor_link.short_description = 'Sponsor'
    sponsor_link.allow_tags = True
