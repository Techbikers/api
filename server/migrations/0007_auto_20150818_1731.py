# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('server', '0006_auto_20150716_1003'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fundraiser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pageId', models.IntegerField()),
                ('pageUrl', models.URLField()),
                ('signOnUrl', models.URLField(null=True, blank=True)),
            ],
            options={
                'db_table': 'fundraisers',
            },
        ),
        migrations.AddField(
            model_name='ride',
            name='fundraising_target',
            field=models.DecimalField(default=500.0, max_digits=6, decimal_places=2),
        ),
        migrations.AddField(
            model_name='ride',
            name='just_giving_event_id',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='fundraiser',
            name='ride',
            field=models.ForeignKey(to='server.Ride'),
        ),
        migrations.AddField(
            model_name='fundraiser',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='fundraiser',
            unique_together=set([('user', 'ride')]),
        ),
    ]
