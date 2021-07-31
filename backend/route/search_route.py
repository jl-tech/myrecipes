import pymysql
from flask import *

import search

SEARCH = Blueprint('SEARCH', __name__, template_folder='templates')


@SEARCH.route("/", methods=['POST'])
def route_search():
    token = request.headers.get("Authorization")
    data = request.get_json()
    name = data['name_keywords']
    type = data['type']
    serving_size = data['serving_size']
    time_to_cook = data['time_to_cook']
    ingredients = data['ingredients']
    step = data['step_keywords']

    result = search.do_search(name, type, serving_size, time_to_cook,
                              ingredients, step)
    if token is not None:
        try:
            search.add_search_history(token, name, ingredients, step)
        except pymysql.err.IntegrityError:
            pass

    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200


@SEARCH.route("/history", methods=['GET'])
def route_search_history():
    token = request.headers.get("Authorization")
    result = search.get_search_history(token)
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200


@SEARCH.route("/history/remove", methods=['DELETE'])
def route_search_history_remove():
    token = request.headers.get("Authorization")
    data = request.get_json()
    search_term = data['search_term']
    time = data['time']

    result = search.delete_search_history(token, search_term, time)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
