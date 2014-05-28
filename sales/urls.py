from django.conf.urls import *
from sales import views
 
urlpatterns = patterns('sales.views',
    url(r'^checkout/(?P<ride_id>\d+)/$', 'checkout', name='checkout'),
    url(r'^tnc/(?P<ride_id>\d+)/$', 'tnc', name='tnc')
)