from server.core.models.fundraisers import Fundraiser


def update_fundraisers():
    fundraisers = Fundraiser.objects.filter(pageStatus=True)

    # Iterate over the objects and update them
    for fundraiser in fundraisers:
        fundraiser.fetch_details()
