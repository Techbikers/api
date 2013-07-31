from django.conf.urls import patterns, url

urlpatterns = patterns('riders.views',
    url(r'^$', 'index'),
    url(r'^login', 'login', name='auth_login'),
    url(r'^logout', 'logout', name='auth_logout'),
    url(r'^register', 'register', name='rider_registration'),
    url(r'^(?P<id>(\d+))/$', 'profile'),
    url(r'^(?P<id>(\d+))/(?P<slug>(.+))/$', 'profile'),
)