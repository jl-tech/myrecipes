from flask import *
import tokenise
import newsfeed


NEWSFEED= Blueprint('NEWSFEED', __name__, template_folder='templates')

@NEWSFEED.route("/subscribe", methods=['POST'])
def route_subscribe():
    token = request.headers.get("Authorization")
    data = request.get_json()
    result = newsfeed.subscribe(token, data["user_id"])
    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid user id to subscribe to'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200