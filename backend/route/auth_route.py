from flask import *
import tokenise
import auth


AUTH = Blueprint('AUTH', __name__, template_folder='templates')


@AUTH.route("/register", methods=['POST'])
def route_auth_register():
    data = request.get_json()
    result = auth.add_new_user(data["email"], data["first_name"], data["last_name"], data["password"])
    if result == 1:
        response = jsonify({'error': 'The email already exists'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == 2:
        response = jsonify({'error': 'Invalid password'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == 0:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@AUTH.route("/emailconfirm", methods=['POST'])
def route_auth_emailconfirm():
    data = request.get_json()
    result = auth.email_confirm(data["code"])
    if result == 0:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    elif result == 1:
        response = jsonify({'error': 'Invalid email verification code'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400


@AUTH.route("/verify", methods=['GET'])
def route_auth_verify():
    token = request.headers.get("Authorization")
    user_id = auth.verify(token)
    if user_id is not None:
        response = jsonify({'user_id': user_id, 'status': 0})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = jsonify({'user_id': -1, 'status': 1})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@AUTH.route("/login", methods=['POST'])
def route_auth_login():
    data = request.get_json()
    correct, user_id = auth.check_password(data["email"], data["password"])
    if correct:
        response = jsonify({'token': tokenise.encode_token({'user_id': user_id})})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    elif not correct and user_id == -1 or not correct and user_id == -2:
        response = jsonify({'error': 'Invalid email or password'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif not correct and user_id == -3:
        response = jsonify({'error': 'That email hasn\'t been verified yet.'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400


@AUTH.route("/forgetpassword", methods=['POST'])
def route_auth_forgetpassword():
    data = request.get_json()
    result = auth.send_reset(data["email"])
    if result == 1:
        response = jsonify({'error': 'Invalid email'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@AUTH.route("/resetpassword", methods=['POST'])
def route_auth_resetpassword():
    data = request.get_json()
    result = auth.reset_password(data["reset_code"], data["password"])
    if result == 1:
        response = jsonify({'error': 'Invalid password reset code'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@AUTH.route("/verifyresetcode", methods=['POST'])
def route_auth_verifyresetcode():
    data = request.get_json()
    result = auth.verify_reset_code(data["reset_code"])
    if result == 1:
        response = jsonify({'error': 'Invalid password reset code'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200