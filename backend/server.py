import flask
import sys
from flask_cors import CORS
from json import dumps
import auth

APP = flask.Flask(__name__)
CORS(APP)

@APP.route("/backend_status", methods=['GET'])
def status():
    return dumps({'status': 200})

if __name__ == "__main__":
    # Testing code
    print(auth.email_already_exists('test@test.com'))
    print(auth.email_already_exists('test@test2.com'))
    print(auth.add_new_user('test@test2.com', 'Test', '2', 'goodpassword'))
    print(auth.email_already_exists('test@test2.com'))
    print(auth.check_password('test@test2.com', 'goodpassword'))
    # End testing code

    if len(sys.argv) != 2:
        print("Usage: backend.py [port]")
    APP.run(port=(int(sys.argv[1])))


