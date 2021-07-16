import flask
import sys

import pymysql
from flask_cors import CORS
from json import dumps
import tokenise
import auth
import threading

from route.auth_route import AUTH
from route.newsfeed_route import NEWSFEED
from route.profile_route import PROFILE
from route.recipe_route import RECIPE
from flask import *

from route.search_route import SEARCH

APP = Flask(__name__)
APP.register_blueprint(AUTH, url_prefix='/auth')
APP.register_blueprint(PROFILE, url_prefix='/profile')
APP.register_blueprint(RECIPE, url_prefix='/recipe')
APP.register_blueprint(SEARCH, url_prefix='/search')
APP.register_blueprint(NEWSFEED, url_prefix='/newsfeed')

CORS(APP)

@APP.route("/backend_status", methods=['GET'])
def status():
    return dumps({'status': 200})





@APP.route("/img/<filename>")
def view_image(filename):
    return redirect(url_for('static', filename='./server_resources/images/' + filename), code=301)

if __name__ == "__main__":
    # Testing code
    # print(auth.email_already_exists('test@test.com'))
    # print(auth.email_already_exists('jonathan.liu2000@gmail.com'))
    # print(auth.add_new_user('jonathan.liu2000@gmail.com', 'Test', '2', 'goodpassword'))
    # print(auth.email_already_exists('jonathan.liu2000@gmail.com'))
    # print(auth.check_password('jonathan.liu2000@gmail.com', 'goodpassword'))
    # print(auth.check_password('jonathan.liu2000@gmail.com', 'badpassword'))
    # print(auth.verify_email(132777754))
    # print(auth.send_reset('jonathan.liu2000@gmail.com'))
    # print(auth.reset_password('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IiQyYiQxMiRRMThSR1JhL0wwM3RXVHdWWkpNbS9PbEpvcC9WUmwuZkhOMGtqZk53MkVlR0ZjT0V3Z2VweSJ9._yDmsNIp1YmVztrmnuRWUQZ80W7-RCmcCAAxP1XXaPM', 'newpwd'))
    # End testing code

    if len(sys.argv) != 2:
        print("Usage: backend.py [port]")
    APP.run(port=(int(sys.argv[1])))


