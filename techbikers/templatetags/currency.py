import locale

from django.template import Library

register = Library()

@register.filter
def currency(value, symbol = True):
    '''
    Currency formatting template filter.

    Takes a number -- integer, float, decimal -- and formats it. It assumes
    that the number is in cents rather than a greater denomination (hence it
    divides by 100)

      * {{ value|currency }}

    The third parameter, symbol, controls whether the currency symbol will be
    printed or not. Defaults to true.

    As advised by the Django documentation, this template won't raise
    exceptions caused by wrong types or invalid locale arguments. It will
    return an empty string instead.
    '''

    locale.setlocale(locale.LC_ALL, 'en_GB')

    return locale.currency(value/100 or 0, symbol, True)