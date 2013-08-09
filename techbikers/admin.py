from django.contrib import admin
from django.core import urlresolvers

from riders.models import RiderProfile
from rides.models import Ride, RideRiders
from chapters.models import Chapter
from sales.models import Sale


class RiderProfileAdmin(admin.ModelAdmin):
    ordering = ['user']
    list_display = ('user', 'company', 'twitter')
    list_filter = ('company',)
admin.site.register(RiderProfile, RiderProfileAdmin)


class RideAdmin(admin.ModelAdmin):
    ordering = ['-start_date']
    list_display = ('name', 'start_date', 'end_date', 'price', 'rider_capacity', 'spaces_left')
    list_filter = ('start_date',)
    readonly_fields = ('get_riders',)
    fields = ('name', 'slug', 'description', 'start_location', 'end_location', ('start_date', 'end_date'), 'rider_capacity', 'price', 'chapter', 'get_riders')

    def get_riders(self, obj):
        return "\n".join([rider.email for rider in obj.riders.all()])
    get_riders.short_description = 'Riders'
admin.site.register(Ride, RideAdmin)


class RideRidersAdmin(admin.ModelAdmin):
    list_display = ('ride', 'user', 'paid', 'signup_date')
    list_filter = ('ride__name',)
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('user_link', 'ride_link', 'sale_link', 'signup_date')
    fields = ('user_link', 'ride_link', 'signup_date', 'pending', 'paid', 'sale_link')

    def user_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.user.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.user.email)
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
    list_display = ('sale_date', 'rider', 'charge_id')
    list_filter = ('sale_date',)
    readonly_fields = ('sale_date', 'charge_id', 'rider_link')
    fields = ('sale_date', 'charge_id', 'rider_link')

    def rider_link(self, obj):
        change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.rider.id,))
        return '<a href="%s">%s</a>' % (change_url, obj.rider.email)
    rider_link.short_description = 'Ride'
    rider_link.allow_tags = True
admin.site.register(Sale, SaleAdmin)