from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to read or edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must be the user themselves or have an attribute
        # named `owner` that matches the current user.
        return obj == request.user or (hasattr(obj, 'owner') and obj.owner == request.user)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must be the user themselves or have an attribute
        # named `owner` that matches the current user.
        return obj == request.user or (hasattr(obj, 'owner') and obj.owner == request.user)