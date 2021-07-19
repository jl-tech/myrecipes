from flask import *

import profile
import tokenise
import auth

PROFILE = Blueprint('PROFILE', __name__, template_folder='templates')

@PROFILE.route("/view", methods=['GET'])
def route_profile_view():
    data = request.args.get('user_id')
    if not data.isnumeric():
        response = jsonify({'error': 'Bad user_id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    result = profile.profile_info(data)
    if result == 1:
        response = jsonify({'error': 'User ID Invalid'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'Email': result['email'], 'FirstName': result['first_name'],
                  'LastName': result['last_name'], 'ProfilePictureURL': result['profile_pic_path'],
                  'RecipeCount': result['recipe_count'], 'Subscribers': result['subscribers']})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@PROFILE.route("/changepassword", methods=['POST'])
def route_profile_changepassword():
    data = request.get_json()
    ok, message = profile.change_password(request.headers.get("Authorization"), data["OldPassword"], data["NewPassword"])
    if ok:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = jsonify({'error': message})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@PROFILE.route("/edit", methods=['POST'])
def route_profile_editprofile():
    data = request.get_json()
    if profile.editprofile(request.headers.get("Authorization"), data["FirstName"], data["LastName"]):
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@PROFILE.route("/changeemail", methods=['POST'])
def route_profile_changeemail():
    data = request.get_json()
    ok, message = profile.changeemail(request.headers.get("Authorization"), data["Email"])
    if ok:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        response = jsonify({'error': message})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

@PROFILE.route("/changepicture", methods=['POST'])
def route_profile_changepicture():
    data = request.get_json()
    file = request.files['ProfilePicture']
    if file.filename != '':
        result, file_name = profile.change_profile_pic(file, request.headers.get("Authorization"))
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
def route_profile_removepicture():
    result, file_name = profile.remove_profile_pic(request.headers.get('Authorization'))
    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'url': file_name})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@PROFILE.route("/recipes", methods=['GET'])
def route_profile_recipes():
    user_id = request.args.get('user_id')

    result = profile.get_profile_recipe(user_id)

    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200

@PROFILE.route("/times_liked", methods=['GET'])
def route_times_liked():
    token = request.headers.get("Authorization")
    user_id = request.args.get('user_id')

    result = profile.get_times_liked(token, user_id)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'times_liked': result})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
