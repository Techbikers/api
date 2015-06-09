# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rideriders',
            name='pending',
        ),
        migrations.AddField(
            model_name='rideriders',
            name='signup_expires',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='rideriders',
            name='status',
            field=models.CharField(default=b'REG', max_length=3, choices=[(b'PEN', b'Pending'), (b'ACC', b'Accepted'), (b'REG', b'Registered'), (b'REJ', b'Rejected')]),
        ),
        migrations.AddField(
            model_name='rideriders',
            name='payload',
            field=jsonfield.fields.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name='rideriders',
            name='signup_date',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterUniqueTogether(
            name='rideriders',
            unique_together=set([('user', 'ride')]),
        ),
        migrations.AlterField(
            model_name='sale',
            name='sale_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 5, 29, 17, 44, 3, 852741)),
        ),
    ]
