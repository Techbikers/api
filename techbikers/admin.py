from django.contrib import admin
from riders.models import RiderProfile
from rides.models import Ride
from chapters.models import Chapter

admin.site.register(RiderProfile)
admin.site.register(Ride)
admin.site.register(Chapter)