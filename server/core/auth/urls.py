from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^complete/(?P<backend>[^/]+)$', 'server.core.auth.views.complete', name='complete'),
    url(r'^login/(?P<backend>[^/]+)$', 'server.core.auth.views.auth', name='login')
)