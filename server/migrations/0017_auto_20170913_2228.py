# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-09-13 21:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0016_auto_20170505_1201'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fundraiser',
            name='fundraisingTarget',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=16, null=True),
        ),
        migrations.AlterField(
            model_name='fundraiser',
            name='giftAid',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=16, null=True),
        ),
        migrations.AlterField(
            model_name='fundraiser',
            name='totalRaised',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=16, null=True),
        ),
        migrations.AlterField(
            model_name='fundraiser',
            name='totalRaisedOffline',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=16, null=True),
        ),
        migrations.AlterField(
            model_name='fundraiser',
            name='totalRaisedOnline',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=16, null=True),
        ),
        migrations.AlterField(
            model_name='fundraiser',
            name='totalRaisedSms',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=16, null=True),
        ),
    ]
