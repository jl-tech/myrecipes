from flask import *
import tokenise
import search

SEARCH = Blueprint('SEARCH', __name__, template_folder='templates')

@SEARCH.route("/", methods=['POST'])
def route_search():
    data = request.get_json()
    name = data['name_keywords']
    type = data['type']
    serving_size = data['serving_size']
    ingredients = data['ingredients']
    step = data['step_keywords']

    result = search.do_search(name, type, serving_size, ingredients, step)

    response = jsonify(result)
    return response, 200




