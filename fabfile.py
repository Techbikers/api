#!/usr/bin/env python
# -*- coding: utf-8 -*-

from fabric.api import *

env.hosts = ['spoke.techbikers.com']
env.user = 'django'
env.project_name = 'techbikers.com'
env.path = '~/%(project_name)s' % env

def setup():
    """
    Setup a fresh virtualenv as well as a few useful directories, then run
    a full deployment
    """
    sudo('pip install virtualenv')
    # we want to get rid of the default apache config
    sudo('mkdir -p %(path)s; chown %(user)s:%(user)s %(path)s;' % env, pty=True)
    run('ln -s %(path)s www;' % env, pty=True) # symlink web dir in home
    with cd(env.path):
        run('virtualenv .;' % env, pty=True)
        run('mkdir logs; chmod a+w logs; mkdir releases; mkdir shared; mkdir packages;' % env, pty=True)
        run('cd releases; ln -s . current; ln -s . previous;', pty=True)
        eun('source ./bin/activate')

def deploy():
    """
    Deploy the latest version of the site to the servers, 
    install any required third party modules, 
    install the virtual host and then restart the webserver
    """
    import time
    env.release = time.strftime('%Y%m%d%H%M%S')
    upload_tar_from_git()
    install_requirements()
    symlink_current_release()
    migrate()
    restart_webserver()
    
def deploy_version(version):
    "Specify a specific version to be made live"
    env.version = version
    with cd(env.path):
        run('rm releases/previous; mv releases/current releases/previous;', pty=True)
        run('ln -s %(version)s releases/current' % env, pty=True)
    restart_webserver()
    
def rollback():
    """
    Limited rollback capability. Simple loads the previously current
    version of the code. Rolling back again will swap between the two.
    """
    with cd(env.path):
        run('mv releases/current releases/_previous;', pty=True)
        run('mv releases/previous releases/current;', pty=True)
        run('mv releases/_previous releases/previous;', pty=True)
    restart_webserver()    
    
# Helpers. These are called by other functions rather than directly

def upload_tar_from_git():
    "Create an archive from the current Git master branch and upload it"
    require('release', provided_by=[deploy, setup])
    local('git archive --format=tar master | gzip > %(release)s.tar.gz' % env)
    run('mkdir -p %(path)s/releases/%(release)s' % env, pty=True)
    put('%(release)s.tar.gz' % env, '%(path)s/packages/' % env)
    run('cd %(path)s/releases/%(release)s && tar zxf ../../packages/%(release)s.tar.gz' % env, pty=True)
    local('rm %(release)s.tar.gz' % env)
    
    
def install_requirements():
    "Install the required packages from the requirements file using pip"
    require('release', provided_by=[deploy, setup])
    run('cd %(path)s; source ./bin/activate; pip install -r ./releases/%(release)s/requirements.txt' % env, pty=True)
    
def symlink_current_release():
    "Symlink our current release"
    require('release', provided_by=[deploy, setup])
    with cd(env.path):
        run('rm releases/previous; mv releases/current releases/previous;')
        run('ln -s %(release)s releases/current' % env)
    
def migrate():
    "Update the database"
    run('cd %(path)s/releases/current; source ../../bin/activate; python manage.py syncdb --noinput' % env, pty=True)
    run('cd %(path)s/releases/current; source ../../bin/activate; python manage.py migrate' % env, pty=True)
    
def restart_webserver():
    "Restart the web server"
    run("supervisorctl restart techbikers.com")
    
