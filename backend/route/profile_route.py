from flask import *
import tokenise
import auth

PROFILE = Blueprint('PROFILE', __name__, template_folder='templates')

@PROFILE.route("/view", methods=['POST'])
def route_auth_profile():
    data = request.get_json()
    result = auth.profile_info(data["userid"])
    if result == 1:
        response = jsonify({'error': 'User ID Invalid'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'Email': result['email'], 'FirstName': result['first_name'],
                  'LastName': result['last_name'], 'ProfilePictureURL': result['profile_pic_path']})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@PROFILE.route("/changepassword", methods=['POST'])
def route_auth_changepassword():
    data = request.get_json()
    ok, message = auth.change_password(request.headers.get("Authorization"), data["OldPassword"], data["NewPassword"])
    if ok:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = jsonify({'error': message})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@PROFILE.route("/edit", methods=['POST'])
def route_auth_editprofile():
    data = request.get_json()
    if auth.editprofile(request.headers.get("Authorization"), data["FirstName"], data["LastName"]):
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@PROFILE.route("/changeemail", methods=['POST'])
def route_auth_changeemail():
    data = request.get_json()
    ok, message = auth.changeemail(request.headers.get("Authorization"), data["Email"])
    if ok:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = jsonify({'error': message})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@PROFILE.route("/changepicture", methods=['POST'])
def route_auth_changepicture():
    data = request.get_json()
    file = request.files['ProfilePicture']
    if file.filename != '':
        result, file_name = auth.change_profile_pic(file, request.headers.get("Authorization"))
    else:
        response = jsonify({'error': 'Unexpected error occured. Try again.'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500
    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'url': file_name})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@PROFILE.route("/removepicture", methods=['GET'])
def route_auth_removepicture():
    result, file_name = auth.remove_profile_pic(request.headers.get('Authorization'))
    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'url': file_name})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200