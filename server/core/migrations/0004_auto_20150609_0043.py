# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0003_auto_20150529_1744'),
    ]

    operations = [
        migrations.CreateModel(
            name='Membership',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_date', models.DateTimeField(auto_now_add=True)),
                ('end_date', models.DateTimeField(default=datetime.datetime(2016, 6, 7, 23, 43, 47, 316463, tzinfo=utc), null=True, blank=True)),
            ],
            options={
                'db_table': 'memberships',
            },
        ),
        migrations.AddField(
            model_name='chapter',
            name='currency',
            field=models.CharField(default=b'gbp', max_length=3, choices=[(b'gbp', b'GBP'), (b'usd', b'USD'), (b'eur', b'EUR')]),
        ),
        migrations.AddField(
            model_name='chapter',
            name='membership_fee',
            field=models.DecimalField(default=0.0, max_digits=6, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='rideriders',
            name='status',
            field=models.CharField(default=b'PEN', max_length=3, choices=[(b'PEN', b'Pending'), (b'ACC', b'Accepted'), (b'REG', b'Registered'), (b'REJ', b'Rejected')]),
        ),
        migrations.AlterField(
            model_name='sale',
            name='sale_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 6, 9, 0, 43, 47, 311963)),
        ),
        migrations.AddField(
            model_name='membership',
            name='chapter',
            field=models.ForeignKey(to='core.Chapter'),
        ),
        migrations.AddField(
            model_name='membership',
            name='sale',
            field=models.ForeignKey(blank=True, to='core.Sale', null=True),
        ),
        migrations.AddField(
            model_name='membership',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chapter',
            name='members',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL, through='core.Membership', blank=True),
        ),
    ]
