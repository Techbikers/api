def no_chrome(request):
    return {
        'NO_CHROME': 'no_chrome' in request.GET or request.POST.get('NO_CHROME', None) in ['1', 'yes', 'y', 'True']
    }