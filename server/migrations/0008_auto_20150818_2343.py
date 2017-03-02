# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0007_auto_20150818_1731'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='riderprofile',
            name='donation_page',
        ),
        migrations.AlterField(
            model_name='membership',
            name='end_date',
            field=models.DateField(default=datetime.date(2016, 8, 17), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='sale',
            name='sale_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 18, 23, 43, 31, 499175)),
        ),
    ]
