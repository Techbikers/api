# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Chapter.stripe_test_priv_key'
        db.add_column('chapters', 'stripe_test_priv_key',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Chapter.stripe_test_pub_key'
        db.add_column('chapters', 'stripe_test_pub_key',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, null=True, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Chapter.stripe_test_priv_key'
        db.delete_column('chapters', 'stripe_test_priv_key')

        # Deleting field 'Chapter.stripe_test_pub_key'
        db.delete_column('chapters', 'stripe_test_pub_key')


    models = {
        'chapters.chapter': {
            'Meta': {'object_name': 'Chapter', 'db_table': "'chapters'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': "'255'"}),
            'stripe_priv_key': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'stripe_pub_key': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'stripe_test_priv_key': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'stripe_test_pub_key': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['chapters']