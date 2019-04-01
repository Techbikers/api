Techbikers Website
==================

This is the main website for Techbikers. The aim is to build this into more
of a platform that allows Techbikers to scale as a charitable organisation
and for Chapters (different branches of Techbikers) around the world to
organise their own rides.

The main components to the site at the moment (and the priorities) are:

* Front facing site. The primary audience are potential donors to riders.
* Rider registration and payment of fee.


Installation
-----------

Ensure you have Python installed (2.7.X) and pip.

    docker-compose build

Checkout and go to the repo then run


Usage
-----

Run from the following commands from the project root.

First build the database.

    docker-compose run api python manage.py migrate

Then create a super user so you can login to the admin console. This will
prompt you to create a username and password for this user.

    docker-compose run api python manage.py createsuperuser

Then start your server!

    docker-compose up


Contributing
------------

Want to contribute? Great! Get in touch tech@techbikers.com

1. Fork it.
2. Create a branch (`git checkout -b my_branch`)
3. Commit your changes (`git commit -am "Added something cool!"`)
4. Push to the branch (`git push origin my_branch`)
5. Open a [Pull Request](https://github.com/Techbikers/techbikers/compare/)
6. Go for a ride on your bike and wait.
