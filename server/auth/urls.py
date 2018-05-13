from django.conf.urls import url, include

from server.auth.views import AuthenticatedUserDetails, UserDetails


urlpatterns = [
    url(r'^verify', AuthenticatedUserDetails.as_view(), name='auth-verify'),
    url(r'^account', UserDetails.as_view(), name='auth-account')
]
