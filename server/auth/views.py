from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import BasicAuthentication

from server.riders.serializers import RiderSerializer


class AuthenticatedUserDetails(RetrieveAPIView):

    """
    This endpoint is used exclusively by Auth0. It will provide details of
    the validated user using Basic Authentication.
    """

    model = User
    queryset = User.objects.all()
    serializer_class = RiderSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (BasicAuthentication,)

    def get_object(self):
        queryset = self.get_queryset()
        filter = {
            'id': self.request.user.id
        }
        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj


class UserDetails(RetrieveAPIView):

    """
    This endpoint is used exclusively by Auth0. It allows an authenticated
    administrator (using basic auth) to lookup a user by their email. This
    is so that Auth0 can check to see if a user does actually exist should
    something like a password reset request be sent to them via our app.
    """

    model = User
    queryset = User.objects.all()
    serializer_class = RiderSerializer
    permission_classes = (IsAdminUser,)
    authentication_classes = (BasicAuthentication,)

    def get_object(self):
        queryset = self.get_queryset()
        filter = {
            'email': self.request.query_params.get('email', None)
        }
        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj
