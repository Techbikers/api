from django.http import Http404
from django.core.urlresolvers import reverse
from django.contrib.auth import REDIRECT_FIELD_NAME

from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from social.utils import sanitize_redirect, user_is_authenticated, user_is_active, partial_pipeline_data, setting_url
from social.apps.django_app.utils import load_strategy, load_backend

from server.api.serializers.auth import PasswordChangeSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, TokenExchangeSerializer

from rest_framework_jwt.settings import api_settings
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class PasswordChange(GenericAPIView):

    """
    Calls Django Auth SetPasswordForm save method.
    Accepts the following POST parameters: new_password1, new_password2
    Returns the success/fail message.
    """

    serializer_class = PasswordChangeSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = self.get_serializer(data=request.DATA)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        return Response({"success": "New password has been saved."})


class PasswordReset(GenericAPIView):

    """
    Calls Django Auth PasswordResetForm save method.
    Accepts the following POST parameters: email
    Returns the success/fail message.
    """

    serializer_class = PasswordResetSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        # Create a serializer with request.DATA
        serializer = self.get_serializer(data=request.DATA)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        # Return the success message with OK HTTP status
        return Response(
            {"success": "Password reset e-mail has been sent."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirm(GenericAPIView):

    """
    Password reset e-mail link is confirmed, therefore this resets the user's password.
    Accepts the following POST parameters: new_password1, new_password2
    Accepts the following Django URL arguments: token, uid
    Returns the success/fail message.
    """

    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.DATA)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        return Response({
            "success": "Password has been reset with the new password.",
            "email": user.email
        })


class TokenExchange(GenericAPIView):

    """
    View to authenticate social auth tokens with python-social-auth. It accepts
    a token and backend. It will validate the token with the backend. If
    successful it returns the local user associated with the social user. If
    there is no associated user it will associate the current logged in user or
    create a new user if not logged in. The user is then logged in and returned
    to the client.
    """

    serializer_class = TokenExchangeSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):

        # request.POST bodge
        # The backend tries to get data from either request.POST
        # or request.GET. These are empty though as DRF uses
        # request.DATA. We need to assing request.POST.
        request._request.POST = request._request.POST.copy()
        for key, value in request.data.items():
            request._request.POST[key] = value

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        backend = serializer.data['backend']
        uri = reverse('auth:complete', args=(backend,))
        strategy = load_strategy(request=request._request)

        try:
            backend = load_backend(strategy, backend, uri)
        except MissingBackend:
            raise Http404('Backend not found')

        data = backend.strategy.request_data()
        user = request.user

        is_authenticated = user_is_authenticated(user)
        user = is_authenticated and user or None

        partial = partial_pipeline_data(backend, user, *args, **kwargs)
        if partial:
            xargs, xkwargs = partial
            user = backend.continue_pipeline(*xargs, **xkwargs)
        else:
            user = backend.complete(user=user, *args, **kwargs)

        # pop redirect value before the session is trashed on login(), but after
        # the pipeline so that the pipeline can change the redirect if needed
        redirect_value = backend.strategy.session_get(REDIRECT_FIELD_NAME, '') or data.get(REDIRECT_FIELD_NAME, '')

        user_model = backend.strategy.storage.user.user_model()
        if user and not isinstance(user, user_model):
            return user

        if is_authenticated:
            if not user:
                url = setting_url(backend, redirect_value, 'LOGIN_REDIRECT_URL')
            else:
                url = setting_url(backend, redirect_value, 'NEW_ASSOCIATION_REDIRECT_URL', 'LOGIN_REDIRECT_URL')
        elif user:
            if user_is_active(user):
                # catch is_new/social_user in case login() resets the instance
                is_new = getattr(user, 'is_new', False)

                if is_new:
                    url = setting_url(backend, 'NEW_USER_REDIRECT_URL', redirect_value, 'LOGIN_REDIRECT_URL')
                else:
                    url = setting_url(backend, redirect_value, 'LOGIN_REDIRECT_URL')
            else:
                url = setting_url(backend, 'INACTIVE_USER_URL', 'LOGIN_ERROR_URL', 'LOGIN_URL')
                return Response({
                        'status': 'Unauthorized',
                        'message': 'The user account is disabled.',
                        'redirect_url': url
                    }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            url = setting_url(backend, 'LOGIN_ERROR_URL', 'LOGIN_URL')

        if redirect_value and redirect_value != url:
            redirect_value = quote(redirect_value)
            url += ('?' in url and '&' or '?') + '{0}={1}'.format(REDIRECT_FIELD_NAME, redirect_value)

        if backend.setting('SANITIZE_REDIRECTS', True):
            url = sanitize_redirect(backend.strategy.request_host(), url) or backend.setting('LOGIN_REDIRECT_URL')

        # Get the JWT payload for the user.
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)

        return Response({
          'token': token,
          'redirect_url': url
        })


