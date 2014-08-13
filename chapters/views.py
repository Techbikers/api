from django.shortcuts import render
from django.http import Http404
from chapters.models import Chapter


def index(request):
    raise Http404


def details(request, name = None):
    # Try and get the chapter details from the name
    try:
        chapter = Chapter.objects.get(name__iexact = name)
    except Chapter.DoesNotExist:
        raise Http404

    return render(request, 'chapters/details.html', {'chapter': chapter})