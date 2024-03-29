"""
Routes for /newsfeed/ calls
"""

from flask import *

import newsfeed

NEWSFEED = Blueprint('NEWSFEED', __name__, template_folder='templates')


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
    elif result == -3:
        response = jsonify({'error': 'Already subscribed to this user'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify(result)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@NEWSFEED.route("/unsubscribe", methods=['POST'])
def route_unsubscribe():
    token = request.headers.get("Authorization")
    data = request.get_json()
    result = newsfeed.unsubscribe(token, data["user_id"])
    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid user id to unsubscribe from'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -3:
        response = jsonify({'error': 'Already unsubscribed from this user'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify(result)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@NEWSFEED.route("/is_subscribed", methods=['GET'])
def route_is_subscribed():
    token = request.headers.get("Authorization")
    data = request.args.get('user_id')
    result = newsfeed.is_subscribed(token, data)
    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'is_subscribed': result})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@NEWSFEED.route("/get_feed", methods=['GET'])
def route_get_feed():
    token = request.headers.get("Authorization")
    page = request.args.get("page")
    result, count = newsfeed.get_feed(token, page)
    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'feed': result, 'count': count})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@NEWSFEED.route("/get_subscriptions", methods=['GET'])
def route_get_subscriptions():
    token = request.headers.get("Authorization")
    result = newsfeed.get_subscriptions(token)
    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify(
            {'Email': result['email'], 'FirstName': result['first_name'],
             'LastName': result['last_name'],
             'ProfilePictureURL': result['profile_pic_path'],
             'RecipeCount': result['recipe_count'],
             'Subscribers': result['subscribers'],
             'Subscriptions': result['subscriptions']})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
