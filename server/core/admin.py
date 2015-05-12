from django.db import models
from django.contrib import admin
from django.core import urlresolvers
from codemirror import CodeMirrorTextarea

from server.core.models.riders import RiderProfile
from server.core.models.rides import Ride, RideRiders
from server.core.models.chapters import Chapter
from server.core.models.sales import Sale


class RiderProfileAdmin(admin.ModelAdmin):
    ordering = ['user']
    list_display = ('user', 'company', 'twitter')
    list_filter = ('company',)
admin.site.register(RiderProfile, RiderProfileAdmin)


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

        return '<ul>%s</ul>' % (''.join([build_list_item(rider) for rider in obj.riders.all()]))
    get_riders.short_description = 'Riders'
    get_riders.allow_tags = True
admin.site.register(Ride, RideAdmin)


class RideRidersAdmin(admin.ModelAdmin):
    list_display = ('ride', 'user_link', 'user', 'paid', 'signup_date')
    list_filter = ('ride__name',)
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('user_link', 'ride_link', 'sale_link', 'signup_date')
    fields = ('user_link', 'user', 'ride_link', 'ride', 'signup_date', 'pending', 'paid', 'sale_link')

    def user_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.user.id,))
        return '<a href="%s">%s %s</a>' % (change_url, obj.user.first_name, obj.user.last_name)
    user_link.short_description = 'User'
    user_link.allow_tags = True

    def ride_link(self, obj):
        change_url = urlresolvers.reverse('admin:rides_ride_change', args=(obj.ride.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.ride.name)
    ride_link.short_description = 'Ride'
    ride_link.allow_tags = True

    def sale_link(self, obj):
        change_url = urlresolvers.reverse('admin:sales_sale_change', args=(obj.sale.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.sale.charge_id)
    sale_link.short_description = 'Sale'
    sale_link.allow_tags = True
admin.site.register(RideRiders, RideRidersAdmin)


class ChapterAdmin(admin.ModelAdmin):
    ordering = ['name']
    list_display = ('name',)
admin.site.register(Chapter, ChapterAdmin)


class SaleAdmin(admin.ModelAdmin):
    ordering = ['-sale_date']
    list_display = ('sale_date', 'rider', 'amount', 'currency', 'livemode', 'charge_id')
    list_filter = ('sale_date',)
    readonly_fields = ('sale_date', 'charge_id', 'card', 'amount', 'currency', 'livemode', 'rider_link')
    fields = ('sale_date', 'charge_id', 'card', 'amount', 'currency', 'livemode', 'rider_link')

    def rider_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.rider.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.rider.email)
    rider_link.short_description = 'Ride'
    rider_link.allow_tags = True
admin.site.register(Sale, SaleAdmin)