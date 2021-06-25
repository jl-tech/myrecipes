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

@APP.route("/auth/register", methods=['POST'])
def route_auth_register():
    data = flask.request.get_json()
    result = auth.add_new_user(data["email"], data["password"], data["first_name"], data["last_name"])
    if result == 1:
        return dumps({'status': 'email_already_exists'})
    elif result == 2:
        return dumps({'status': 'password_requirements_fail'})
    elif result == 0:
        return dumps({'status': 'OK'})

@APP.route("/auth/emailconfirm", methods=['POST'])
def route_auth_emailconfirm():
    data = flask.request.get_json()
    result = auth.verify_email(data["code"])
    if result == 0:
        return dumps({'status': 'OK'})
    elif result == 1:
        return dumps({'status': 'invalid_code'})

if __name__ == "__main__":
    # Testing code
    # print(auth.email_already_exists('test@test.com'))
    # print(auth.email_already_exists('jonathan.liu2000@gmail.com'))
    # print(auth.add_new_user('jonathan.liu2000@gmail.com', 'Test', '2', 'goodpassword'))
    # print(auth.email_already_exists('jonathan.liu2000@gmail.com'))
    # print(auth.check_password('jonathan.liu2000@gmail.com', 'goodpassword'))
    # print(auth.check_password('jonathan.liu2000@gmail.com', 'badpassword'))
    print(auth.verify_email(248190294))
    # End testing code

    if len(sys.argv) != 2:
        print("Usage: backend.py [port]")
    APP.run(port=(int(sys.argv[1])))


