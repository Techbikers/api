from django.conf.urls import patterns, url

urlpatterns = patterns('chapters.views',
    url(r'^$', 'index', name='chapters'),
    url(r'^(?P<name>(.+))/$', 'details', name='chapter'),
)