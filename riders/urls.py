from django.conf.urls import patterns, url

urlpatterns = patterns('riders.views',
    url(r'^$', 'index'),
    url(r'^login', 'login', name='auth_login'),
    url(r'^logout', 'logout', name='auth_logout'),
    url(r'^register', 'register', name='rider_registration'),
    url(r'^(?P<id>(\d+))/$', 'profile'),
    url(r'^(?P<id>(\d+))/(?P<slug>(.+))/$', 'profile'),
)

urlpatterns += patterns('',
    url(r'^password/reset/$', 'django.contrib.auth.views.password_reset', {
        'post_reset_redirect' : '/riders/password/reset/done/',
        'template_name': 'riders/resetpassword.html'
    }, name='reset_password'),
    url(r'^password/reset/done/$', 'django.contrib.auth.views.password_reset_done', {
        'template_name': 'riders/resetpassword_done.html'
    }),
    url(r'^password/reset/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', 'django.contrib.auth.views.password_reset_confirm', {
        'post_reset_redirect' : '/riders/password/done/',
        'template_name': 'riders/resetpassword_confirm.html'
    }),
    url(r'^password/done/$', 'django.contrib.auth.views.password_reset_complete', {
        'template_name': 'riders/resetpassword_complete.html'
    }),
)