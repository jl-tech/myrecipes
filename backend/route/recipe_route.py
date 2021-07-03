from flask import *
import tokenise
import recipe
import json

RECIPE = Blueprint('RECIPE', __name__, template_folder='templates')

@RECIPE.route("/create", methods=['POST'])
def route_recipe_create():

    photos = request.files.getlist('photos[]')
    name = request.form['name']
    type = request.form['type']
    time = request.form['time']
    serving_size = request.form['serving_size']
    ingredients = json.loads(request.form['ingredients'])['ingredients']
    print(ingredients)
    steps = json.loads(request.form['steps'])['steps']
    result = recipe.add_recipe(request.headers.get("Authorization"), name, type, int(time), int(serving_size),  ingredients, steps, photos)
    if result != 0:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
