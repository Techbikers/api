# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0008_auto_20150818_2343'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundraiser',
            name='fundraisingTarget',
            field=models.DecimalField(null=True, max_digits=6, decimal_places=2, blank=True),
        ),
        migrations.AddField(
            model_name='fundraiser',
            name='giftAid',
            field=models.DecimalField(null=True, max_digits=6, decimal_places=2, blank=True),
        ),
        migrations.AddField(
            model_name='fundraiser',
            name='pageStatus',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='fundraiser',
            name='totalRaised',
            field=models.DecimalField(null=True, max_digits=6, decimal_places=2, blank=True),
        ),
        migrations.AddField(
            model_name='fundraiser',
            name='totalRaisedOffline',
            field=models.DecimalField(null=True, max_digits=6, decimal_places=2, blank=True),
        ),
        migrations.AddField(
            model_name='fundraiser',
            name='totalRaisedOnline',
            field=models.DecimalField(null=True, max_digits=6, decimal_places=2, blank=True),
        ),
        migrations.AddField(
            model_name='fundraiser',
            name='totalRaisedSms',
            field=models.DecimalField(null=True, max_digits=6, decimal_places=2, blank=True),
        ),
        migrations.AlterField(
            model_name='membership',
            name='end_date',
            field=models.DateField(default=datetime.date(2016, 9, 7), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='sale',
            name='sale_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 9, 8, 9, 29, 30, 307392)),
        ),
    ]
