from fabric.api import *

env.hosts = ['spoke.techbikers.com']
env.user = 'django'

def deploy():
    "Updates the repository."
    print "ENV %s" %(env.hosts)
    run("cd ~/webapps/techbikers.com/; git pull")
    sudo("supervisorctl restart techbikers.com")
