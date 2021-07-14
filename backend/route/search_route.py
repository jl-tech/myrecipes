from flask import *
import tokenise
import search

SEARCH = Blueprint('SEARCH', __name__, template_folder='templates')

@SEARCH.route("/", methods=['POST'])
def route_search():
    token = request.headers.get("Authorization")
    data = request.get_json()
    name = data['name_keywords']
    type = data['type']
    serving_size = data['serving_size']
    ingredients = data['ingredients']
    step = data['step_keywords']

    result = search.do_search(name, type, serving_size, ingredients, step)
    if token is not None:
        search.add_search_history(token, name, ingredients, step)

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

