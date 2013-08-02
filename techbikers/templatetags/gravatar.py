from django.template import Library
import urllib
import hashlib

register = Library()

@register.simple_tag
def gravatar_url(email, size=80):
    return "https://www.gravatar.com/avatar/" + hashlib.md5(email.lower()).hexdigest() + "?" + urllib.urlencode({'s': str(size)})


@register.simple_tag
def gravatar(email, size=80, options=""):
    url = gravatar_url(email, size)
    return '<img src="%s" width="%s" height="%s" %s />' % (url, size, size, options)