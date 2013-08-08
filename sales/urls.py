from django.conf.urls import *
from sales import views
 
urlpatterns = patterns('sales.views',
    url(r'^checkout/$', 'checkout', name='checkout'),
    url(r'^success/$', 'success', name='success'),
)