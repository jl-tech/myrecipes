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

@RECIPE.route('/view', methods=['GET'])
def route_recipe_view():
    recipe_id = request.args.get('recipe_id')
    result = recipe.get_recipe_details(recipe_id)
    if result == -1:
        response = jsonify({'error': 'Invalid recipe id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify(result)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@RECIPE.route('/editdescription', methods=['POST'])
def route_recipe_edit_description():
    data = request.get_json()
    name = data['name']
    type = data['type']
    time = data['time']
    serving_size = data['serving_size']
    recipe_id = data['recipe_id']
    token = request.headers.get("Authorization")

    result = recipe.edit_recipe_description(token, recipe_id, name, type, time, serving_size)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid recipe id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -3:
        response = jsonify({'error': 'You don\'t have permission to edit this reicpe'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@RECIPE.route('/editingredients', methods=['POST'])
def route_recipe_edit_ingredients():
    data = request.get_json()
    ingredients = data['ingredients']
    recipe_id = data['recipe_id']
    token = request.headers.get("Authorization")

    result = recipe.edit_recipe_ingredients(token, recipe_id, ingredients)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid recipe id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -3:
        response = jsonify({'error': 'No edit right'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

@RECIPE.route('/editsteps', methods=['POST'])
def route_recipe_edit_steps():
    data = request.get_json()
    steps = data['steps']
    recipe_id = request.args.get('recipe_id')
    token = request.headers.get("Authorization")

    result = recipe.edit_recipe_steps(token, recipe_id, steps)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid recipe id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -3:
        response = jsonify({'error': 'No edit right'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

