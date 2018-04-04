from os import environ
from google.appengine.ext import ndb
from google.appengine.ext.ndb import model


class Settings(ndb.Model):
    value = ndb.StringProperty()

    @classmethod
    def get(cls, name):
        # Unique canary value (`None` may be a valid value for this config item)
        NOT_SET_VALUE = u'!!!__ NOT SET __!!!'

        # Need to ensure uniqueness in a transaction
        entity = cls(key=model.Key(cls, name))
        entity.populate(value=NOT_SET_VALUE)
        txn = lambda: entity.put() if not entity.key.get() else entity.key
        retval = model.transaction(txn).get()

        if retval.value == NOT_SET_VALUE:
            raise Exception((
                '%s %s not found in the database. A placeholder ' +
                'record has been created. Go to the Developers Console for your app ' +
                'in App Engine, look up the Settings record with name=%s and enter ' +
                'its value in that record\'s value field. ') % (cls.__name__, name, name))

        return retval.value
