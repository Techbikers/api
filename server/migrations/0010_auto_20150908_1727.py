# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0009_auto_20150908_0929'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundraiser',
            name='currency',
            field=models.CharField(default=b'GBP', max_length=3),
        ),
        migrations.AlterField(
            model_name='sale',
            name='sale_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 9, 8, 17, 27, 17, 21023)),
        ),
    ]
