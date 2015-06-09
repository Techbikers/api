# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20150529_1744'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rideriders',
            name='status',
            field=models.CharField(default=b'PEN', max_length=3, choices=[(b'PEN', b'Pending'), (b'ACC', b'Accepted'), (b'REG', b'Registered'), (b'REJ', b'Rejected')]),
        ),
        migrations.AlterField(
            model_name='sale',
            name='sale_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 5, 29, 17, 44, 15, 636342)),
        ),
    ]
