import stripe
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import generics, filters, status
from rest_framework.response import Response

from server.chapters.models import Chapter
from server.sales.models import Sale
from server.chapters.serializers import ChapterSerializer
from server.riders.serializers import RiderSerializer


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
