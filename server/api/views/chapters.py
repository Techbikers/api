import stripe
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import generics, filters, status
from rest_framework.response import Response
from server.core.models.chapters import Chapter
from server.core.models.sales import Sale
from server.api.serializers.chapters import ChapterSerializer
from server.api.serializers.riders import RiderSerializer
from server.api.serializers.memberships import MembershipSerializer


class ChaptersList(generics.ListAPIView):
    model = Chapter
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('=name',)


class ChapterDetails(generics.RetrieveAPIView):
    model = Chapter
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    lookup_field = 'id'


class ChapterMembersList(generics.ListCreateAPIView):
    def get_queryset(self):
        """
        Only return users who are current members of the chapter
        """
        return User.objects.filter(
            membership__chapter__id=self.kwargs.get('id'),
            membership__end_date__gte=timezone.now())

    def get_serializer_class(self):
        """
        We want to return a list of the riders that are members when the action
        is 'list'. When the action is 'create' we want to try and create a new
        membership object for the current user so use the MembershipSerializer instead.
        """
        if self.request.method == 'POST':
            return MembershipSerializer
        return RiderSerializer

    def perform_create(self, serializer):
        """
        Before we go to the MembershipSerializer to create a new object, we first
        want to try and create a sale and charge the user (if the price is above
        zero). If this fails then stop here.
        """
        request = self.request
        chapter = Chapter.objects.get(id=self.kwargs.get('id'))
        if chapter.membership_fee > 0:
            sale = Sale.charge(
                request.data.get('token'),
                chapter.private_key,
                int(chapter.membership_fee * 100),
                chapter.currency,
                "Techbikers Membership: {0}".format(request.user.email))
            sale.rider_id = request.user.id
            sale.save()

            serializer.save(user=request.user, chapter=chapter, sale=sale)
        else:
            serializer.save(user=request.user, chapter=chapter)