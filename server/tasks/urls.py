from django.conf.urls import url, include

from server.tasks import views

urlpatterns = [
    url(r'^daily-slack-update', views.daily_slack_update, name='daily-slack-update'),
    url(r'^update-fundraisers', views.update_fundraisers, name='update-fundraisers'),
    url(r'^update-mailchimp-list', views.update_mailchimp_list, name='update-mailchimp-list')
]
