# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0004_auto_20150609_0043'),
    ]

    operations = [
        migrations.AddField(
            model_name='ride',
            name='full_cost',
            field=models.DecimalField(default=0.0, max_digits=6, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='membership',
            name='end_date',
            field=models.DateField(default=datetime.date(2016, 7, 7), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='membership',
            name='start_date',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='sale',
            name='sale_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 8, 11, 9, 59, 198340)),
        ),
    ]
