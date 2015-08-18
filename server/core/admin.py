from django import forms
from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.core import urlresolvers
from suit.widgets import LinkedSelect
from codemirror import CodeMirrorTextarea

from server.core.models.riders import RiderProfile
from server.core.models.rides import Ride, RideRiders
from server.core.models.chapters import Chapter
from server.core.models.sales import Sale
from server.core.models.memberships import Membership
from server.core.models.sponsors import Sponsor, RideSponsor


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
    readonly_fields = ('user_link',)
    fields = ('user_link', 'company', 'website', 'twitter', 'biography', 'statement', 'donation_page')
    list_display = ('user', 'company', 'twitter', 'is_member')
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
            'fields': ['name', 'slug', 'start_location', 'end_location', 'start_date', 'end_date', 'rider_capacity', 'preregistration_required', 'price', 'full_cost', 'currency', 'chapter', 'fundraising_target', 'just_giving_event_id',]
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-description',),
            'fields': ['description',]}),
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
    list_display = ('view_edit', 'ride_link', 'user_link', 'user', 'status', 'paid', 'signup_date')
    list_filter = ('ride__name', 'status')
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('user_link', 'ride_link', 'sale_link', 'signup_date')
    fields = ('user_link', 'user', 'ride_link', 'ride', 'signup_date', 'signup_expires', 'status', 'paid', 'sale_link', 'payload')
    actions = ['invite_rider']

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
        change_url = urlresolvers.reverse('admin:core_ride_change', args=(obj.ride.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.ride.name)
    ride_link.short_description = 'Ride'
    ride_link.allow_tags = True

    def sale_link(self, obj):
        change_url = urlresolvers.reverse('admin:core_sale_change', args=(obj.sale.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.sale.charge_id)
    sale_link.short_description = 'Sale'
    sale_link.allow_tags = True




# CHAPTER ADMIN
# -------------

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    ordering = ['name']
    list_display = ('name',)




# CHAPTER MEMBERSHIP ADMIN
# ------------------------

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ('chapter', 'user_link', 'user', 'start_date', 'end_date', 'expired')
    list_filter = ('chapter__name',)
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('user_link', 'chapter_link', 'start_date', 'sale_link')
    fields = ('user_link', 'user', 'chapter_link', 'chapter', 'start_date', 'end_date', 'sale_link')

    def user_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.user.id,))
        return '<a href="%s">%s %s</a>' % (change_url, obj.user.first_name, obj.user.last_name)
    user_link.short_description = 'User'
    user_link.allow_tags = True

    def chapter_link(self, obj):
        change_url = urlresolvers.reverse('admin:core_chapter_change', args=(obj.chapter.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.chapter.name)
    chapter_link.short_description = 'Chapter'
    chapter_link.allow_tags = True

    def sale_link(self, obj):
        change_url = urlresolvers.reverse('admin:core_sale_change', args=(obj.sale.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.sale.charge_id)
    sale_link.short_description = 'Sale'
    sale_link.allow_tags = True




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
        change_url = urlresolvers.reverse('admin:core_ride_change', args=(obj.ride.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.ride.name)
    ride_link.short_description = 'Ride'
    ride_link.allow_tags = True

    def sponsor_link(self, obj):
        change_url = urlresolvers.reverse('admin:core_sponsor_change', args=(obj.sponsor.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.sponsor.organisation)
    sponsor_link.short_description = 'Sponsor'
    sponsor_link.allow_tags = True