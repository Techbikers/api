# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings
import server.models.sponsors


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('server', '0005_auto_20150708_1109'),
    ]

    operations = [
        migrations.CreateModel(
            name='RideSponsor',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sponsor_level', models.CharField(max_length=10, choices=[(b'gold', b'Gold Level'), (b'silver', b'Silver Level'), (b'bronze', b'Bronze Level'), (b'bottle', b'Bottle'), (b'kit', b'Kit'), (b'inkind', b'In Kind'), (b'homecoming', b'Homecoming Party')])),
                ('ride', models.ForeignKey(to='server.Ride')),
            ],
            options={
                'db_table': 'ride_sponsors',
            },
        ),
        migrations.CreateModel(
            name='Sponsor',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('organisation', models.CharField(max_length=b'255')),
                ('description', models.TextField(blank=True)),
                ('logo', models.ImageField(upload_to=server.models.sponsors.generate_filename)),
                ('website', models.URLField(blank=True)),
                ('twitter', models.URLField(blank=True)),
                ('facebook', models.URLField(blank=True)),
                ('riders', models.ManyToManyField(to=settings.AUTH_USER_MODEL, blank=True)),
                ('rides', models.ManyToManyField(to='server.Ride', through='server.RideSponsor', blank=True)),
            ],
            options={
                'db_table': 'sponsors',
            },
        ),
        migrations.AlterField(
            model_name='membership',
            name='end_date',
            field=models.DateField(default=datetime.date(2016, 7, 15), null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='sale',
            name='sale_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 16, 10, 3, 1, 334247)),
        ),
        migrations.AddField(
            model_name='ridesponsor',
            name='sponsor',
            field=models.ForeignKey(to='server.Sponsor'),
        ),
        migrations.AlterUniqueTogether(
            name='ridesponsor',
            unique_together=set([('ride', 'sponsor')]),
        ),
    ]
