from rest_framework import generics, filters
from server.core.models.chapters import Chapter
from server.api.serializers.chapters import ChapterSerializer


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