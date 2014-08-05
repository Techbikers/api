from django.conf.urls import patterns, url

urlpatterns = patterns('rides.views',
    url(r'^$', 'index', name='rides'),
    url(r'^(?P<id>(\d+))/$', 'details'),
    url(r'^(?P<id>(\d+))/(?P<slug>(.+))/$', 'details'),
)