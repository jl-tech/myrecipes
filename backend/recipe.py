"""
This file contains functions associated with viewing, creating, and modifying
recipes.
"""

import os

import requests

import helpers
import tokenise

DEFAULT_PIC = 'default.png'


def add_recipe(token, name, type, time, serving_size, ingredients, steps,
               photos, photo_names, description):
    '''
    Adds a recipe to the database.
    :param token: the token of the user creating recipe
    :param name: name of the recipe
    :param type: type of the recipe
    :param time: time to cook for recipe
    :param serving_size: serving size of recipe
    :param ingredients: Array of dictionaries of the form with fields name,
    quantity, unit
    :param steps: Array of text - list of steps
    :param photos: Array of files - list of photos
    :param photo_names: Array of file names - list of photo names
    :param description: recipe description
    :returns:
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    # do Recipe table
    # -> get user id from token
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        con.close()
        return -1

    if description == '':
        description = None

    # -> do query
    query = '''
            insert into Recipes(created_by_user_id, creation_time, 
            time_to_cook, name, type, serving_size, description) 
            values (%s, UTC_TIMESTAMP(), %s, %s, %s, %s, %s)
    '''

    cur.execute(query, (
    int(u_id), int(time), name, type, int(serving_size), description))
    cur.execute('select LAST_INSERT_ID()')
    created_recipe_id = cur.fetchall()[0]['LAST_INSERT_ID()']

    # do RecipeIngredients table
    query = '''
               insert into RecipeIngredients(recipe_id, ingredient_no, 
               ingredient_name, quantity, unit)
               values (%s, %s, %s, %s, %s) 
               '''
    for index, ingredient in enumerate(ingredients):
        quantity = ingredient['quantity']
        if quantity == '':
            quantity = None
        elif quantity is not None:
            quantity = float(quantity)
        unit = ingredient['unit']
        if unit == '':
            unit = None
        cur.execute(query, (
        int(created_recipe_id), int(index), ingredient['name'], quantity, unit))

    # do RecipeSteps table
    query = '''
                insert into RecipeSteps(recipe_id, step_no, step_text, 
                step_photo_path)
                values (%s, %s, %s, NULL) 
    '''
    for index, step in enumerate(steps):
        cur.execute(query,
                    (int(created_recipe_id), int(index), step['description']))

    # do RecipePhotos table
    query = '''
                insert into RecipePhotos(recipe_id, photo_no, photo_path, 
                photo_name)
                values (%s, %s, %s, %s) 
    '''
    for index, photo in enumerate(photos):
        path = helpers.store_image(photo)
        cur.execute(query, (
        int(created_recipe_id), int(index), path, photo_names[index]))

    con.commit()
    con.close()

    return created_recipe_id


def get_recipe_details(recipe_id):
    '''
    Gets details of a recipe.
    :param recipe_id: the recipe id to get details of
    :returns: Dictionary with every field in Recipes and Users
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    query = ''' select * from Recipes join Users on user_id = 
    created_by_user_id where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    if len(result) != 1:
        con.close()
        return -1
    result = result[0]

    out = result
    out['profile_pic_path'] = result['profile_pic_path'] if result[
                                                                'profile_pic_path'] is not None else DEFAULT_PIC

    # ingredients
    query = '''select * from RecipeIngredients where recipe_id = %s order by 
    ingredient_no'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    out['ingredients'] = []
    for row in result:
        curr_dict = {'name': row['ingredient_name'],
                     'quantity': row['quantity'], 'unit': row['unit']}
        out['ingredients'].append(curr_dict)

    # steps
    query = '''select * from RecipeSteps where recipe_id = %s order by 
    step_no'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    out['steps'] = []
    for row in result:
        curr_dict = {'description': row['step_text']}
        out['steps'].append(curr_dict)

    # photos
    query = '''select * from RecipePhotos where recipe_id = %s order by 
    photo_no'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    out['photos'] = []
    for row in result:
        curr_dict = {'url': row['photo_path'],
                     'name': row['photo_name']}
        out['photos'].append(curr_dict)

    # comments
    query = """
            select C.*, U.user_id, U.first_name, U.last_name,
                COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """') as 
                profile_pic_path
            from Comments C
                join Users U on C.by_user_id = U.user_id
            where C.recipe_id = %s
            order by C.time_created
        """
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    out['comments'] = result

    # likes
    query = "select U.user_id, U.first_name, U.last_name, COALESCE(" \
                    "U.profile_pic_path, '" + DEFAULT_PIC + "') as " \
                    "profile_pic_path " \
                    "from " \
                    "Likes L " \
                    "join Users U on " \
                    "L.liked_by_user_id = " \
                    "U.user_id where " \
                    "L.recipe_id = %s"
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    out['likes_users'] = result

    # contributor stats
    query = """
            select COUNT(*) 
            from SubscribedTo 
            where is_subscribed_to = %s
        """
    cur.execute(query, out['created_by_user_id'])

    out['contributor_subscribers_count'] = cur.fetchall()[0]['COUNT(*)']

    query = """
                select COUNT(*) 
                from Recipes 
                where created_by_user_id = %s
            """
    cur.execute(query, out['created_by_user_id'])

    out['contributor_recipes_count'] = cur.fetchall()[0]['COUNT(*)']

    con.close()

    out['recommendations'] = get_recipe_recommendations(recipe_id)

    return out


def edit_recipe_description(token, recipe_id, name, type, time, serving_size,
                            description):
    '''
    edit given recipe's description
    :param token: the token of the user executing the edit
    :param recipe_id: recipe's id in database
    :param name: new recipe's name
    :param type: new recipe's type
    :param time: new recipe's cooking time
    :param serving_size: new recipe's serving size
    :param description: new description
    :returns:
    -1 for invalid token
    -2 for invalid recipe id
    -3 for inconsistent editor(token) and creator('created_by_user_id' in
    database)
    1 for success
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    check_result = check_recipe_edit(token, recipe_id)
    if check_result != 0:
        con.close()
        return check_result, None

    query = '''update Recipes set time_to_cook=%s, name=%s,type=%s,
    serving_size=%s, edit_time=UTC_TIMESTAMP(), description=%s where 
    recipe_id=%s'''
    cur.execute(query, (
    int(time), name, type, int(serving_size), description, int(recipe_id)))
    con.commit()

    query = ''' select edit_time from Recipes where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    con.close()
    return 1, result[0]


def edit_recipe_ingredients(token, recipe_id, ingredients):
    '''
    overwrite all old ingredients in database by new ingredients for given
    recipe
    :param token: the token of the user performing the edit
    :param recipe_id: recipe's id in database
    :param ingredients: new ingredients of the recipe
    :returns:
    -1 for invalid token
    -2 for invalid recipe id
    -3 for inconsistent editor(token) and creator('created_by_user_id' in
    database)
    1 for success
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()

    check_result = check_recipe_edit(token, recipe_id)
    if check_result != 0:
        con.close()
        return check_result, None

    query_update = '''update RecipeIngredients 
                        set ingredient_name=%s, quantity=%s, unit=%s 
                        where recipe_id=%s and ingredient_no=%s'''
    query_select = '''select * from RecipeIngredients where recipe_id = %s 
    and ingredient_no=%s'''
    query_insert = '''
                    insert into RecipeIngredients(recipe_id, ingredient_no, 
                    ingredient_name, quantity, unit)
                    values (%s, %s, %s, %s, %s) 
                    '''

    last_idx = -1
    for index, ingredient in enumerate(ingredients):
        cur.execute(query_select, (int(recipe_id), int(index)))
        result = cur.fetchall()
        # this ingredient_no doesn't exist in database
        quantity = ingredient['quantity']
        if quantity == '':
            quantity = None
        elif quantity is not None:
            quantity = float(quantity)
        unit = ingredient['unit']
        if unit == '':
            unit = None
        if len(result) == 0:
            cur.execute(query_insert, (
            int(recipe_id), int(index), ingredient['name'], quantity, unit))
        # exist
        else:
            cur.execute(query_update, (
            ingredient['name'], quantity, unit, int(recipe_id), int(index),))
        last_idx = index

    # delete remaining (excess) ingredients if the number of ingredients
    # has been reduced
    query_remove = '''delete from RecipeIngredients where recipe_id = %s and 
    ingredient_no = %s '''
    while True:
        last_idx += 1
        cur.execute(query_select, (int(recipe_id), int(last_idx)))
        result = cur.fetchall()
        if len(result) == 0:
            break
        else:
            cur.execute(query_remove, (int(recipe_id), int(last_idx)))

    query_update_edit = ''' update Recipes set edit_time = UTC_TIMESTAMP() 
    where recipe_id = %s'''
    cur.execute(query_update_edit, (int(recipe_id),))
    con.commit()

    query = ''' select edit_time from Recipes where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    con.close()
    return 1, result[0]


def edit_recipe_steps(token, recipe_id, steps):
    '''
    overwrite all old steps in database by new steps for given recipe
    :param token:
    :param recipe_id: recipe's id in database
    :param steps: new cooking steps of the recipe
    :returns:
    -1 for invalid token
    -2 for invalid recipe id
    -3 for inconsistent editor(token) and creator('created_by_user_id' in
    database)
    1 for success
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()

    check_result = check_recipe_edit(token, recipe_id)
    if check_result != 0:
        con.close()
        return check_result, None

    query_update = '''update RecipeSteps set step_text=%s where recipe_id=%s 
    and step_no=%s'''
    query_select = '''select * from RecipeSteps where recipe_id = %s and 
    step_no=%s'''
    query_insert = '''
                insert into RecipeSteps(recipe_id, step_no, step_text, 
                step_photo_path)
                values (%s, %s, %s, NULL) 
    '''
    last_idx = -1
    for index, step in enumerate(steps):
        cur.execute(query_select, (int(recipe_id), int(index),))
        result = cur.fetchall()
        # this ingredient_no doesn't exist in database
        if len(result) == 0:
            cur.execute(query_insert,
                        (int(recipe_id), int(index), step['description'],))
        # exist
        else:
            cur.execute(query_update,
                        (step['description'], int(recipe_id), int(index),))
        last_idx = index

        # delete remaining (steps) ingredients if the number of ingredients
        # has been reduced
        query_remove = '''delete from RecipeSteps where recipe_id = %s 
        and step_no = %s '''
        while True:
            last_idx += 1
            cur.execute(query_select, (int(recipe_id), int(last_idx)))
            result = cur.fetchall()
            if len(result) == 0:
                break
            else:
                cur.execute(query_remove, (int(recipe_id), int(last_idx)))

    query_update_edit = ''' update Recipes set edit_time = UTC_TIMESTAMP() 
    where recipe_id = %s'''
    cur.execute(query_update_edit, (int(recipe_id),))
    con.commit()

    query = ''' select edit_time from Recipes where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    con.close()
    return 1, result[0]


def edit_recipe_photos(token, recipe_id, photos, photo_names):
    '''
    Edits the photos associated with a recipe
    :recipe_id: the recipe id to change
    :param photos: The new photos array
    :param photo_names: The new photo_names array
    :returns: 0 on success. -2 if the recipe id couldn't be found. -1 if the
    token was invalid.
    '''
    con = helpers.get_db_conn()

    cur = con.cursor()

    check_result = check_recipe_edit(token, recipe_id)
    if check_result != 0:
        con.close()
        return check_result, None

    # delete existing photos and remove from database
    query = ''' select photo_path from RecipePhotos where recipe_id = %s'''
    cur.execute(query, (recipe_id,))
    for photo_path in cur.fetchall():
        try:
            print(
                "./static/server_resources/images/" + photo_path['photo_path'])
            os.remove(
                "./static/server_resources/images/" + photo_path['photo_path'])
        except:
            pass

    query = ''' delete from RecipePhotos where recipe_id = %s '''
    cur.execute(query, (recipe_id,))

    # do RecipePhotos table
    query = '''
                    insert into RecipePhotos(recipe_id, photo_no, photo_path, 
                    photo_name)
                    values (%s, %s, %s, %s) 
        '''
    for index, photo in enumerate(photos):
        path = helpers.store_image(photo)
        cur.execute(query, (
            int(recipe_id), int(index), path, photo_names[index]))

    query_update_edit = ''' update Recipes set edit_time = UTC_TIMESTAMP() 
    where recipe_id = %s'''
    cur.execute(query_update_edit, (int(recipe_id),))
    con.commit()

    query = ''' select edit_time from Recipes where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    con.close()
    return 0, result[0]


def check_recipe_edit(token, recipe_id):
    '''
    Performs the auth and db checks necessary for a edit operation.
    :param token: The token of the user
    :param recipe_id: The recipe_id attempting to edit
    :returns: 0 if OK. -1 if the token is invalid. -2 if the recipe id is
    invalid.
    -3 if the user isn't authorised to edit this recipe.
    '''
    cur = helpers.get_db_conn().cursor()

    # get user id from token
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        return -1

    query = ''' select * from Recipes where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    if len(result) == 0:
        return -2

    # recipe can only edit by creator
    if int(result[0]['created_by_user_id']) != int(u_id):
        return -3

    return 0


def delete_recipe(token, recipe_id):
    '''
    Deletes a recipe
    :param token: The token of the user
    :param recipe_id: The id of recipe attempting to delete
    :returns: 
    0 if OK.
    -1 if the token is invalid.
    -2 if the recipe id is invalid.
    -3 if the user isn't authorised to delete this recipe.
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    check_result = check_recipe_edit(token, recipe_id)

    if check_result != 0:
        con.close()
        return check_result

    query = '''delete from RecipeIngredients where recipe_id = %s'''
    cur.execute(query, (recipe_id))
    query = '''delete from RecipeSteps where recipe_id = %s'''
    cur.execute(query, (recipe_id))
    query = ''' select photo_path from RecipePhotos where recipe_id = %s'''
    cur.execute(query, (recipe_id))

    for photo_path in cur.fetchall():
        try:
            os.remove(photo_path)
        except:
            pass

    query = '''delete from RecipePhotos where recipe_id = %s'''
    cur.execute(query, (recipe_id))
    query = '''delete from Comments where recipe_id = %s'''
    cur.execute(query, (recipe_id))
    query = '''delete from Likes where recipe_id=%s'''
    cur.execute(query, (recipe_id))
    query = '''delete from Recipes where recipe_id = %s'''
    cur.execute(query, (recipe_id))

    con.commit()
    con.close()
    return 0


def recipe_nutrition(recipe_id):
    '''
    Gets the nutrition information for the given recipe.
    :param recipe_id: The id of recipe
    :returns: Nutrition dictionary.
    -1 if the recipe id is invalid.
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    query = '''select ingredient_name, quantity, unit, serving_size from 
    RecipeIngredients RI join Recipes R on RI.recipe_id = R.recipe_id where 
    RI.recipe_id = %s'''

    if cur.execute(query, (recipe_id)) == 0:
        con.close()
        return -1

    nutrition = {
        'calories': 0,
        'total_fat': 0,
        'saturated_fat': 0,
        'cholesterol': 0,
        'sodium': 0,
        'total_carbohydrate': 0,
        'dietary_fiber': 0,
        'sugars': 0,
        'protein': 0,
        'potassium': 0,
        'p': 0
    }
    url = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
    # myrecipes 1 (app-id key) = c7b72621 f4f179ad2b66776956d0ca1daa4213c2
    # myrecipes 2 (app-id key) = 5773eec9 724bb52ca50b08599849779c1101a3d3
    # myrecipes 3 (app-id key) = 6944d86b 9453e5df6bc944849f07a9aa40c3e2ed
    headers = {'Content-Type': 'application/json', 'x-app-id': '6944d86b',
               'x-app-key': '9453e5df6bc944849f07a9aa40c3e2ed',
               'x-remote-user-id': '0'}

    result = cur.fetchall()
    all_ingredients = ""

    for ingredients in result:
        q = ' '.join((str(ingredients['quantity']),
                      ingredients['unit'] if ingredients[
                                                 'unit'] is not None else "",
                      ingredients['ingredient_name']))
        all_ingredients += q + "\n"
    payload = {'query': all_ingredients}
    r = requests.post(url, headers=headers, json=payload)

    try:
        for n in r.json()['foods']:
            nutrition['calories'] += n['nf_calories'] if n[
                                                             'nf_calories'] \
                                                         is not None else 0
            nutrition['total_fat'] += n['nf_total_fat'] if n[
                                                               'nf_total_fat'] is not None else 0
            nutrition['saturated_fat'] += n['nf_saturated_fat'] if n[
                                                                       'nf_saturated_fat'] is not None else 0
            nutrition['cholesterol'] += n['nf_cholesterol'] if n[
                                                                   'nf_cholesterol'] is not None else 0
            nutrition['sodium'] += n['nf_sodium'] if n[
                                                         'nf_sodium'] is not \
                                                     None else 0
            nutrition['total_carbohydrate'] += n['nf_total_carbohydrate'] if n[
                                                                                 'nf_total_carbohydrate'] is not None else 0
            nutrition['dietary_fiber'] += n['nf_dietary_fiber'] if n[
                                                                       'nf_dietary_fiber'] is not None else 0
            nutrition['sugars'] += n['nf_sugars'] if n[
                                                         'nf_sugars'] is not \
                                                     None else 0
            nutrition['protein'] += n['nf_protein'] if n[
                                                           'nf_protein'] is \
                                                       not None else 0
            nutrition['potassium'] += n['nf_potassium'] if n[
                                                               'nf_potassium'] is not None else 0
            nutrition['p'] += n['nf_p'] if n['nf_p'] is not None else 0
    except KeyError:
        return -2

    for i in nutrition:
        nutrition[i] = round(nutrition[i] / result[0]['serving_size'], 1)

    query = """
    update Recipes
    set calories = %s
    where recipe_id = %s
    """
    cur.execute(query, (round(nutrition['calories'] / 100, 0) * 100, recipe_id))
    con.commit()
    con.close()
    return nutrition


def recipe_comment(token, recipe_id, comment):
    '''
    Adds a comment to the recipe.
    :param token: The token of the user
    :param recipe_id: The id of recipe
    :param comment: The string of the comment
    :returns: An updated array of comments associated with the given recipe
    -1 if the token is invalid.
    -2 if the recipe id is invalid.
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    u_id = tokenise.token_to_id(token)

    if u_id < 0:
        con.close()
        return -1

    query = '''select * from Recipes where recipe_id = %s'''

    if cur.execute(query, (recipe_id)) == 0:
        con.close()
        return -2

    query = '''insert into Comments (recipe_id, by_user_id, time_created, 
    comment_text) values (%s, %s, UTC_TIMESTAMP(), %s)'''
    cur.execute(query, (recipe_id, u_id, comment))

    con.commit()

    query = """
            select C.*, U.user_id, U.first_name, U.last_name,
                COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """') as 
                profile_pic_path
            from Comments C
                join Users U on C.by_user_id = U.user_id
            where C.recipe_id = %s
            order by C.time_created
        """
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    con.close()
    return result


def recipe_comment_delete(token, comment_id):
    '''
    Deletes a comment specified by comment_id.
    :param token: The token of the user
    :param comment_id: The id of the comment
    :returns: An updated array of comments associated with the recipe where
    the comment was deleted from.
    -1 if token is invalid.
    -2 if comment_id is invalid.
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    u_id = tokenise.token_to_id(token)

    if u_id < 0:
        con.close()
        return -1

    query = '''select * from Comments where comment_id = %s and by_user_id = 
    %s'''

    if cur.execute(query, (comment_id, u_id)) == 0:
        con.close()
        return -2

    recipe_id = cur.fetchall()[0]['recipe_id']

    query = 'delete from Comments where comment_id = %s'
    cur.execute(query, (comment_id))

    con.commit()

    query = """
            select C.*, U.user_id, U.first_name, U.last_name,
                COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """') as 
                profile_pic_path
            from Comments C
                join Users U on C.by_user_id = U.user_id
            where C.recipe_id = %s
            order by C.time_created
        """
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    con.close()
    return result


def recipe_like_toggle(token, recipe_id):
    '''
    Likes or unlikes a given recipe for the user.
    :param token: The token of the user
    :param recipe_id: The id of recipe
    :returns: 
    0 if OK.
    -1 if the token is invalid.
    -2 if the recipe id is invalid.
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    u_id = tokenise.token_to_id(token)

    if u_id < 0:
        con.close()
        return -1

    query = '''select * from Recipes where recipe_id = %s'''

    if cur.execute(query, (recipe_id)) == 0:
        con.close()
        return -2

    query = ''' select * from Likes where liked_by_user_id = %s and recipe_id 
    = %s'''
    cur.execute(query, (u_id, recipe_id))
    result = cur.fetchall()
    if len(result) == 0:
        query = "insert into Likes(recipe_id, liked_by_user_id) values (%s, %s)"
        cur.execute(query, (int(recipe_id), int(u_id),))
    else:
        query = "delete from Likes where liked_by_user_id = %s and recipe_id " \
                "= %s"
        cur.execute(query, (int(u_id), int(recipe_id)))

    con.commit()

    # likes
    query = "select U.user_id, U.first_name, U.last_name, COALESCE(" \
                    "U.profile_pic_path, '" + DEFAULT_PIC + "') as " \
                    "profile_pic_path " \
                    "from " \
                    "Likes L " \
                    "join Users U on " \
                    "L.liked_by_user_id = " \
                    "U.user_id where " \
                    "L.recipe_id = %s"
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    con.close()
    return result


def recipe_is_liked(token, recipe_id):
    '''
    Checks whether the user has liked a given recipe.
    :param token: The token of the user
    :param recipe_id: The id of recipe
    :returns: Boolean on success.
    -1 if the token is invalid.
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    u_id = tokenise.token_to_id(token)

    if u_id < 0:
        con.close()
        return -1

    query = ''' select * from Likes where liked_by_user_id = %s and recipe_id
     = %s'''
    cur.execute(query, (u_id, recipe_id))
    result = cur.fetchall()
    con.close()
    return len(result) != 0


def get_recipe_recommendations(recipe_id):
    '''
    Finds recipe recommendations based on the current recipe.
    :param recipe_id: The id of recipe.
    :returns: Array of recipes.
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()

    # First get recipes with matching keywords in name
    query = """select name from Recipes where recipe_id = %s"""
    cur.execute(query, (recipe_id,))
    name = cur.fetchall()[0]['name']

    query = """
    select distinct R.recipe_id, R.name, R.creation_time, R.edit_time,
            R.time_to_cook, R.type, R.serving_size, RP.photo_path, 
            R.description,
            U.first_name, U.last_name, COALESCE(U.profile_pic_path, '""" + \
            DEFAULT_PIC + """') as profile_pic_path,
            U.user_id, R.calories, (select count(*) from Likes L where 
            R.recipe_id = L.recipe_id) as likes,
            (select count(*) from Comments C where R.recipe_id = C.recipe_id) 
            as comments,
            match(R.name) against (%s in natural language mode) as relevance
        from Recipes R
            left outer join (select * from RecipePhotos where photo_no = 0) 
            RP on R.recipe_id = RP.recipe_id
            join Users U on R.created_by_user_id = U.user_id 
        where match(R.name) against (%s in natural language mode) and 
        R.recipe_id != %s
        order by relevance desc, likes desc
        limit 2
    """

    cur.execute(query, (name, name, int(recipe_id)))
    result = cur.fetchall()

    if len(result) < 3:
        query = """
                    select t.recipe_id, R.name, R.creation_time, 
                    R.edit_time,
                        R.time_to_cook, R.type, R.serving_size, 
                        RP.photo_path, R.description,
                        U.first_name, U.last_name, COALESCE(
                        U.profile_pic_path, '""" + DEFAULT_PIC + """') as 
                        profile_pic_path,
                        U.user_id, R.calories, (select count(*) from Likes L 
                        where R.recipe_id = L.recipe_id) as likes,
                        (select count(*) from Comments C where R.recipe_id = 
                        C.recipe_id) as comments,
                        count(*) /
                        ((select count(*) from RecipeIngredients P where P.recipe_id = %s) +
                        (select count(*) from RecipeIngredients Q where Q.recipe_id = t.recipe_id) - count(*))
                        as jaccard
                    from (select I.ingredient_name as i1, J.ingredient_name 
                            as i2, J.recipe_id from RecipeIngredients I left outer 
                            join RecipeIngredients J on J.ingredient_name like 
                            concat(%s, I.ingredient_name, %s) where I.recipe_id = %s 
                            and I.recipe_id <> J.recipe_id
                            union
                            select I.ingredient_name as i1, J.ingredient_name as 
                            i2, J.recipe_id from RecipeIngredients I left outer 
                            join RecipeIngredients J on I.ingredient_name like 
                            concat(%s, J.ingredient_name, %s) where I.recipe_id = 
                            %s and I.recipe_id <> J.recipe_id) as t
                        join Recipes R on R.recipe_id = t.recipe_id
                        left outer join (select * from RecipePhotos where photo_no = 0) RP on R.recipe_id = RP.recipe_id
                        join Users U on R.created_by_user_id = U.user_id 
                    group by t.recipe_id
                    order by jaccard desc
                    limit 3
                """
        cur.execute(query, (int(recipe_id), '%', '%', int(recipe_id), '%', '%', int(recipe_id)))
        if isinstance(result, tuple):
            result = []

        prev_result = result
        currlen = len(prev_result)
        for item in cur.fetchall():
            if currlen > 2:
                break
            is_not_duplicate = True
            for r in prev_result:
                if item['recipe_id'] == r['recipe_id']:
                    is_not_duplicate = False
                    break
            if is_not_duplicate:
                del item['jaccard']
                result.append(item)
                currlen += 1

    con.close()

    return result
