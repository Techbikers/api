from django.conf.urls import url

from .views import complete, auth

urlpatterns = [
    url(r'^complete/(?P<backend>[^/]+)', complete, name='complete'),
    url(r'^login/(?P<backend>[^/]+)', auth, name='login')
]
