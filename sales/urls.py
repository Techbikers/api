from django.conf.urls.defaults import *
from sales import views
 
urlpatterns = patterns('sales.views',
    url(r'^$', views.charge, name="charge"),
)