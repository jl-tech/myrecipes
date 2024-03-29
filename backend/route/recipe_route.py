"""
Routes for /recipe/ calls
"""

import json

from flask import *

import recipe

RECIPE = Blueprint('RECIPE', __name__, template_folder='templates')


@RECIPE.route("/create", methods=['POST'])
def route_recipe_create():
    photos = request.files.getlist('photos[]')
    name = request.form['name']
    type = request.form['type']
    time = request.form['time']
    description = request.form['description']
    serving_size = request.form['serving_size']
    ingredients = json.loads(request.form['ingredients'])
    steps = json.loads(request.form['steps'])
    photo_names = json.loads(request.form['photo_names'])
    recipe_id = recipe.add_recipe(request.headers.get("Authorization"), name,
                                  type, int(time), int(serving_size),
                                  ingredients, steps, photos, photo_names,
                                  description)
    if recipe_id < 0:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'recipeId': recipe_id})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/view', methods=['GET'])
def route_recipe_view():
    data = request.args.get('recipe_id')
    if not data.isnumeric():
        response = jsonify({'error': 'Bad recipe_id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    result = recipe.get_recipe_details(data)
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
    description = data['description']
    token = request.headers.get("Authorization")

    result, ret = recipe.edit_recipe_description(token, recipe_id, name, type,
                                                 time, serving_size,
                                                 description)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid recipe id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -3:
        response = jsonify(
            {'error': 'You don\'t have permission to edit this reicpe'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify(ret)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/editingredients', methods=['POST'])
def route_recipe_edit_ingredients():
    data = request.get_json()
    ingredients = data['ingredients']
    recipe_id = data['recipe_id']
    token = request.headers.get("Authorization")

    result, ret = recipe.edit_recipe_ingredients(token, recipe_id, ingredients)

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
        response = jsonify(ret)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/editsteps', methods=['POST'])
def route_recipe_edit_steps():
    data = request.get_json()
    steps = data['steps']
    recipe_id = data['recipe_id']
    token = request.headers.get("Authorization")

    result, ret = recipe.edit_recipe_steps(token, recipe_id, steps)

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
        response = jsonify(ret)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/editphotos', methods=['POST'])
def route_recipe_edit_photos():
    photos = request.files.getlist('photos[]')
    recipe_id = request.form['recipe_id']
    photo_names = json.loads(request.form['photo_names'])
    token = request.headers.get("Authorization")

    result, ret = recipe.edit_recipe_photos(token, recipe_id, photos,
                                            photo_names)

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
        response = jsonify(ret)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/delete', methods=['DELETE'])
def route_recipe_delete():
    token = request.headers.get("Authorization")
    data = request.get_json()
    recipe_id = data['recipe_id']

    result = recipe.delete_recipe(token, recipe_id)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid recipe id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -3:
        response = jsonify({'error': 'No delete right'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/nutrition', methods=['GET'])
def route_recipe_nutrition():
    recipe_id = request.args.get('recipe_id')
    result = recipe.recipe_nutrition(recipe_id)

    if result == -1:
        response = jsonify({'error': 'Invalid recipe id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    if result == -2:
        response = jsonify(
            {'error': 'Could not fetch nutrition data at this time'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify(result)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/comment', methods=['POST'])
def route_recipe_comment():
    token = request.headers.get("Authorization")
    data = request.get_json()
    recipe_id = data['recipe_id']
    comment = data['comment']

    result = recipe.recipe_comment(token, recipe_id, comment)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid recipe id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify(result)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/comment/delete', methods=['POST'])
def route_recipe_comment_delete():
    token = request.headers.get("Authorization")
    data = request.get_json()
    comment_id = data['comment_id']

    result = recipe.recipe_comment_delete(token, comment_id)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid comment id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify(result)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/like', methods=['POST'])
def route_recipe_like():
    token = request.headers.get("Authorization")
    data = request.get_json()
    recipe_id = data['recipe_id']

    result = recipe.recipe_like_toggle(token, recipe_id)

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    elif result == -2:
        response = jsonify({'error': 'Invalid recipe id'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify(result)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


@RECIPE.route('/is_liked', methods=['GET'])
def route_recipe_is_liked():
    token = request.headers.get("Authorization")
    data = request.args.get("recipe_id")
    result = recipe.recipe_is_liked(token, data)
    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({'is_liked': result})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
