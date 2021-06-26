import flask
import sys

import pymysql
from flask_cors import CORS
from json import dumps
import tokenise
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

@APP.route("/auth/verify", methods=['GET'])
def route_auth_verify():
    result = auth.token_to_email(flask.request.args.get("token"))
    if result == -1:
        return dumps({'status': 'invalid_token'})
    elif result == -2:
        return dumps({'status': 'email_not_registered'})
    elif result == -3:
        return dumps({'status': 'email_not_verified'})
    else:
        return dumps({'email': result})

@APP.route("/auth/login", methods=['POST'])
def route_auth_login():
    data = flask.request.get_json()
    correct = auth.check_password(data["email"], data["password"])
    if correct:
        return dumps({
            'status': 'OK',
            'token':  tokenise.encode_token({'email': data["email"]})
        })
    elif not correct:
        return dumps({'status': 'invalid_combination'})

@APP.route("/auth/forgetpassword", methods=['POST'])
def route_auth_forgetpassword():
    data = flask.request.get_json()
    result = auth.send_reset(data["email"])
    if result == 1:
        return dumps({'status': 'email_not_found'})
    else:
        return dumps({'status': 'OK'})

@APP.route("/auth/resetpassword", methods=['POST'])
def route_resetpassword():
    data = flask.request.get_json()
    result = auth.reset_password(data["reset_code"], data["password"])
    if result == 1:
        return dumps({'status': 'reset_code_invalid'})
    else:
        return dumps({'status': 'OK'})

@APP.route("/auth/profile", methods=['POST'])
def route_profile():
    data = flask.request.get_json()
    result = auth.profile_info(data["user_id"])
    return dumps({'Email': result['email'], 'FirstName': result['first_name'],
                  'LastName': result['last_name'], 'ProfilePictureURL': result['profile_pic_path']})

@APP.route("/auth/changepassword", methods=['POST'])
def changepassword():
    email = auth.token_to_email(flask.request.args.get("token"))
    data = flask.request.get_json()
    if not auth.change_password(email, data["OldPassword"], data["NewPassword"]):
        return dumps({'status': 'old password invalid'})
    else:
        return dumps({'status': 'OK'})

@APP.route("/auth/editprofile", methods=['POST'])
def editprofile():
    data = flask.request.get_json()
    if auth.editprofile(data["Token"], data["FirstName"], data["LastName"]):
        return dumps({'status': 'OK'})
    else:
        return dumps({'status': 'edit profile unsuccessful'})


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
    print(auth.reset_password('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IiQyYiQxMiRRMThSR1JhL0wwM3RXVHdWWkpNbS9PbEpvcC9WUmwuZkhOMGtqZk53MkVlR0ZjT0V3Z2VweSJ9._yDmsNIp1YmVztrmnuRWUQZ80W7-RCmcCAAxP1XXaPM', 'newpwd'))
    # End testing code

    if len(sys.argv) != 2:
        print("Usage: backend.py [port]")
    APP.run(port=(int(sys.argv[1])))


