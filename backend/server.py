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
    result = auth.add_new_user(data["email"], data["first_name"], data["last_name"], data["password"])
    if result == 1:
        response = flask.jsonify({'error': 'The email already exists'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == 2:
        response = flask.jsonify({'error': 'Invalid password'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == 0:
        response = flask.jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@APP.route("/auth/emailconfirm", methods=['POST'])
def route_auth_emailconfirm():
    data = flask.request.get_json()
    result = auth.email_confirm(data["code"])
    if result == 0:
        response = flask.jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    elif result == 1:
        response = flask.jsonify({'error': 'Invalid email verification code'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@APP.route("/auth/verify", methods=['GET'])
def route_auth_verify():
    token = flask.request.headers.get("Authorization")
    user_id = auth.verify(token)
    if user_id is not None:
        response = flask.jsonify({'user_id': user_id})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = flask.jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@APP.route("/auth/login", methods=['POST'])
def route_auth_login():
    data = flask.request.get_json()
    correct, user_id = auth.check_password(data["email"], data["password"])
    if correct:
        response = flask.jsonify({'token': tokenise.encode_token({'user_id': user_id})})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    elif not correct and user_id == -1 or not correct and user_id == -2:
        response = flask.jsonify({'error': 'Invalid email or password'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif not correct and user_id == -3:
        response = flask.jsonify({'error': 'That email hasn\'t been verified yet.'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@APP.route("/auth/forgetpassword", methods=['POST'])
def route_auth_forgetpassword():
    data = flask.request.get_json()
    # TODO threading
    result = auth.send_reset(data["email"])
    if result == 1:
        response = flask.jsonify({'error': 'Invalid email'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = flask.jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@APP.route("/auth/resetpassword", methods=['POST'])
def route_auth_resetpassword():
    data = flask.request.get_json()
    result = auth.reset_password(data["reset_code"], data["password"])
    if result == 1:
        response = flask.jsonify({'error': 'Reset Code Invalid'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = flask.jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@APP.route("/auth/profile", methods=['GET'])
def route_auth_profile():
    data = flask.request.args.get("userid")
    result = auth.profile_info(data)
    if result == 1:
        response = flask.jsonify({'error': 'User ID Invalid'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = flask.jsonify({'Email': result['email'], 'FirstName': result['first_name'],
                  'LastName': result['last_name'], 'ProfilePictureURL': result['profile_pic_path']})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@APP.route("/auth/changepassword", methods=['POST'])
def route_auth_changepassword():
    token = flask.request.headers.get("Authorization")
    email = auth.token_to_email(token)
    if not isinstance(email, str) and email < 1:
        response = flask.jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    data = flask.request.get_json()
    if not auth.change_password(email, data["OldPassword"], data["NewPassword"]):
        response = flask.jsonify({'error': 'Old password invalid'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = flask.jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@APP.route("/auth/editprofile", methods=['POST'])
def route_auth_editprofile():
    data = flask.request.get_json()
    if auth.editprofile(flask.request.headers.get("Authorization"), data["FirstName"], data["LastName"]):
        response = flask.jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = flask.jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@APP.route("/auth/changeemail", methods=['POST'])
def route_auth_changeemail():
    data = flask.request.get_json()
    if auth.changeemail(flask.request.headers.get("Authorization"), data["Email"]):
        response = flask.jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = flask.jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@APP.route("/auth/changepicture", methods=['POST'])
def route_auth_changepicture():
    data = flask.request.get_json()
    file = flask.request.files['ProfilePicture']
    if file.filename != '':
        result = auth.change_profile_pic(file, data['token'])
    else:
        response = flask.jsonify({'error': 'Unexpected error occured. Try again.'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500
    if result == -1:
        response = flask.jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = flask.jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

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


