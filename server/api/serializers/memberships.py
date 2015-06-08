from rest_framework import serializers
from server.core.models.memberships import Membership


class MembershipSerializer(serializers.ModelSerializer):
    rider = serializers.PrimaryKeyRelatedField(source='user', read_only=True)
    chapter = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Membership
        write_only_fields = ('sale',)
        fields = ('rider', 'chapter', 'start_date', 'end_date', 'expired')
