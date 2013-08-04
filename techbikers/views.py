from django.shortcuts import render


def index(request):
    return render(request, 'index.html')

def the_ride(request):
    return render(request, 'the_ride.html')

def about(request):
    return render(request, 'about.html')