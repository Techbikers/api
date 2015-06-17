from django.db import models
from django.contrib import admin
from django.core import urlresolvers
from django.forms import TextInput, ModelForm
from codemirror import CodeMirrorTextarea

from server.core.models.riders import RiderProfile
from server.core.models.rides import Ride, RideRiders
from server.core.models.chapters import Chapter
from server.core.models.sales import Sale
from server.core.models.memberships import Membership


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


@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    ordering = ['-start_date']
    list_display = ('name', 'start_date', 'end_date', 'price', 'currency', 'rider_capacity', 'spaces_left')
    list_filter = ('start_date',)
    readonly_fields = ('get_riders',)
    fields = (('name', 'slug'), ('start_location', 'end_location'), ('start_date', 'end_date'), 'rider_capacity', 'preregistration_required', ('price', 'currency'), 'chapter', 'description', 'terms_and_conditions', 'get_riders')
    formfield_overrides = {
        models.TextField: {'widget': CodeMirrorTextarea(mode='markdown', config={'lineWrapping': True, 'lineNumbers': False})},
    }

    def get_riders(self, obj):
        def build_list_item(rider):
            change_url = urlresolvers.reverse('admin:auth_user_change', args=(rider.id,))
            return '<li><a href="%s">%s %s (%s)</a></li>' % (change_url, rider.first_name, rider.last_name, rider.email)

        return '<ul>%s</ul>' % (''.join([build_list_item(rider) for rider in obj.registered_riders]))
    get_riders.short_description = 'Confirmed Riders'
    get_riders.allow_tags = True


@admin.register(RideRiders)
class RideRidersAdmin(admin.ModelAdmin):
    list_display = ('view_edit', 'ride_link', 'user_link', 'user', 'status', 'paid', 'signup_date')
    list_filter = ('ride__name', 'status')
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('user_link', 'ride_link', 'sale_link', 'signup_date')
    fields = ('user_link', 'user', 'ride_link', 'ride', 'signup_date', 'signup_expires', 'status', 'paid', 'sale_link', 'payload')

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


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    ordering = ['name']
    list_display = ('name',)


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