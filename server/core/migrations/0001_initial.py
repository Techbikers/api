# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=b'255')),
                ('stripe_priv_key', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('stripe_pub_key', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('stripe_test_priv_key', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('stripe_test_pub_key', models.CharField(default=b'', max_length=255, null=True, blank=True)),
            ],
            options={
                'db_table': 'chapters',
            },
        ),
        migrations.CreateModel(
            name='Ride',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=b'255')),
                ('slug', models.CharField(unique=True, max_length=b'255')),
                ('description', models.TextField(blank=True)),
                ('start_location', models.CharField(max_length=b'255')),
                ('end_location', models.CharField(max_length=b'255')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('preregistration_required', models.BooleanField(default=False)),
                ('rider_capacity', models.IntegerField(default=0)),
                ('price', models.DecimalField(default=0.0, max_digits=6, decimal_places=2)),
                ('currency', models.CharField(default=b'gbp', max_length=3, choices=[(b'gbp', b'GBP'), (b'usd', b'USD'), (b'eur', b'EUR')])),
                ('terms_and_conditions', models.TextField(default=b'', null=True, blank=True)),
                ('chapter', models.ForeignKey(blank=True, to='core.Chapter', null=True)),
            ],
            options={
                'db_table': 'rides',
            },
        ),
        migrations.CreateModel(
            name='RideRiders',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('signup_date', models.DateTimeField(default=datetime.datetime(2015, 5, 29, 17, 37, 31, 739772))),
                ('pending', models.BooleanField()),
                ('paid', models.BooleanField()),
                ('ride', models.ForeignKey(to='core.Ride')),
            ],
            options={
                'db_table': 'rides_riders',
            },
        ),
        migrations.CreateModel(
            name='RiderProfile',
            fields=[
                ('user', models.OneToOneField(related_name='profile', primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('company', models.CharField(max_length=200, null=True, blank=True)),
                ('website', models.URLField(null=True, blank=True)),
                ('twitter', models.CharField(max_length=200, null=True, blank=True)),
                ('biography', models.TextField(null=True, blank=True)),
                ('statement', models.TextField(null=True, blank=True)),
                ('donation_page', models.URLField(null=True, blank=True)),
            ],
            options={
                'db_table': 'riders_profiles',
            },
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sale_date', models.DateTimeField(default=datetime.datetime(2015, 5, 29, 17, 37, 31, 737665))),
                ('charge_id', models.CharField(max_length=32)),
                ('amount', models.IntegerField(null=True, blank=True)),
                ('currency', models.CharField(default=b'gbp', max_length=3, choices=[(b'gbp', b'GBP'), (b'usd', b'USD'), (b'eur', b'EUR')])),
                ('livemode', models.BooleanField()),
                ('card', models.CharField(max_length=255, null=True, blank=True)),
                ('rider', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'sales',
            },
        ),
        migrations.AddField(
            model_name='rideriders',
            name='sale',
            field=models.ForeignKey(blank=True, to='core.Sale', null=True),
        ),
        migrations.AddField(
            model_name='rideriders',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='ride',
            name='riders',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL, through='core.RideRiders', blank=True),
        ),
    ]
