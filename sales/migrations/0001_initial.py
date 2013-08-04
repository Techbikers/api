# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Sale'
        db.create_table('sales', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('charge_id', self.gf('django.db.models.fields.CharField')(max_length=32)),
            ('rider_id', self.gf('django.db.models.fields.CharField')(max_length=32)),
        ))
        db.send_create_signal('sales', ['Sale'])


    def backwards(self, orm):
        # Deleting model 'Sale'
        db.delete_table('sales')


    models = {
        'sales.sale': {
            'Meta': {'object_name': 'Sale', 'db_table': "'sales'"},
            'charge_id': ('django.db.models.fields.CharField', [], {'max_length': '32'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'rider_id': ('django.db.models.fields.CharField', [], {'max_length': '32'})
        }
    }

    complete_apps = ['sales']