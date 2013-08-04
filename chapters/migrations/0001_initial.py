# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Chapter'
        db.create_table('chapters', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length='255')),
        ))
        db.send_create_signal('chapters', ['Chapter'])


    def backwards(self, orm):
        # Deleting model 'Chapter'
        db.delete_table('chapters')


    models = {
        'chapters.chapter': {
            'Meta': {'object_name': 'Chapter', 'db_table': "'chapters'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': "'255'"})
        }
    }

    complete_apps = ['chapters']