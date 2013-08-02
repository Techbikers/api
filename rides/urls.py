from django.conf.urls import patterns, url

urlpatterns = patterns('rides.views',
    url(r'^$', 'index'),
    url(r'^(?P<slug>(.+))/$', 'details'),
)