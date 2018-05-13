from django.conf.urls import url, include

from server.chapters.views import ChaptersList, ChapterDetails


urlpatterns = [
    url(r'^(?P<id>\d+)', ChapterDetails.as_view(), name='chapter-details'),
    url(r'^$', ChaptersList.as_view(), name='chapters-list')
]
