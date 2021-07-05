import os

import helpers
from constants import *

import bcrypt
import pymysql
import smtplib

import tokenise

import sys
import hashlib

from PIL import Image

import mimetypes

import threading

DEFAULT_PIC = 'default.png'

def add_recipe(token, name, type, time, serving_size, ingredients, steps, photos, photo_names):
    '''
    :param token:
    :param name:
    :param type:
    :param time:
    :param serving_size:
    :param ingredients: Array of dictionaries of the form with fields name, quantity, unit
    :param steps: Array of text
    :param photos: Array of files
    :return:
    '''

    query_lock.acquire()
    cur = con.cursor()
    # do Recipe table
    # -> get user id from token
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return u_id, -1

    # -> do query
    query = '''
            insert into Recipes(created_by_user_id, creation_time, time_to_cook, name, type, serving_size) 
            values (%s, UTC_TIMESTAMP(), %s, %s, %s, %s)
    '''

    cur.execute(query, (int(u_id), int(time), name, type, int(serving_size)))
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
        cur.execute(query, (int(created_recipe_id), int(index), ingredient['name'], quantity, unit))

    # do RecipeSteps table
    query = '''
                insert into RecipeSteps(recipe_id, step_no, step_text, step_photo_path)
                values (%s, %s, %s, NULL) 
    '''
    for index, step in enumerate(steps):
        cur.execute(query, (int(created_recipe_id), int(index), step['description']))


    # do RecipePhotos table
    query = '''
                insert into RecipePhotos(recipe_id, photo_no, photo_path, photo_name)
                values (%s, %s, %s, %s) 
    '''
    for index, photo in enumerate(photos):
        path = helpers.store_image(photo)
        cur.execute(query, (int(created_recipe_id), int(index), path, photo_names[index]))

    con.commit()
    query_lock.release()

    return 0, created_recipe_id

def get_recipe_details(recipe_id):
    '''
    Gets details of a recipe.
    :param recipe_id: the recipe id to get details of
    :return: Dictionary with fields:
        - name: string
        - creation_time: string
        - edit_time: string, null if not edited
        - contributor_user_id: integer
        - type: string
        - time_to_cook: integer
        - serving_size: integer
        - ingredients: array of dictionaries (dict has keys  name, quantity, unit)
        - steps: array of strings
        - photos: array of strings (corresponding to path of image)
        -1 if the recipe id was invalid
    '''
    query_lock.acquire()
    cur = con.cursor()
    out = {}
    query = ''' select * from Recipes join Users on user_id = created_by_user_id where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    if len(result) != 1:
        query_lock.release()
        return -1
    result = result[0]

    out['name'] = result['name']
    out['creation_time'] = result['creation_time']
    out['created_by_user_id'] = result['created_by_user_id']
    out['type'] = result['type']
    out['time_to_cook'] = result['time_to_cook']
    out['serving_size'] = result['serving_size']
    out['edit_time'] = result['edit_time']
    out['first_name'] = result['first_name']
    out['last_name'] = result['last_name']
    out['profile_pic_path'] = result['profile_pic_path'] if result['profile_pic_path'] is not None else DEFAULT_PIC


    # ingredients
    query = '''select * from RecipeIngredients where recipe_id = %s order by ingredient_no'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    out['ingredients'] = []
    for row in result:
        curr_dict = {'name': row['ingredient_name'],
                     'quantity': row['quantity'], 'unit': row['unit']}
        out['ingredients'].append(curr_dict)


    # steps
    query = '''select * from RecipeSteps where recipe_id = %s order by step_no'''
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

    query_lock.release()
    return out

def edit_recipe_description(token, recipe_id, name, type, time, serving_size):
    '''
        edit given recipe's description
        :param token:
        :param recipe_id: recipe's id in database
        :param name: new recipe's name
        :param type: new recipe's type
        :param time: new recipe's cooking time
        :param serving_size: new recipe's serving size
        :return:
        -1 for invalid token
        -2 for invalid recipe id
        -3 for inconsistent editor(token) and creator('created_by_user_id' in database)
        1 for success
        '''
    query_lock.acquire()
    cur = con.cursor()
    # get user id from token
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1

    query = ''' select * from Recipes where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    if len(result) != 1:
        query_lock.release()
        return -2

    # recipe can only edit by creator
    if int(result[0]['created_by_user_id']) != int(u_id):
        query_lock.release()
        return -3

    query = '''update Recipes set time_to_cook=%s, name=%s,type=%s,serving_size=%s, edit_time=UTC_TIMESTAMP() where recipe_id=%s'''
    cur.execute(query, (int(time), name, type, int(serving_size), int(recipe_id),))
    con.commit()
    query_lock.release()
    return 1

def edit_recipe_ingredients(token, recipe_id, ingredients):
    '''
        overwrite all old ingredients in database by new ingredients for given recipe
        :param token:
        :param recipe_id: recipe's id in database
        :param ingredients: new ingredients of the recipe
        :return:
        -1 for invalid token
        -2 for invalid recipe id
        -3 for inconsistent editor(token) and creator('created_by_user_id' in database)
        1 for success
        '''
    query_lock.acquire()
    cur = con.cursor()
    # get user id from token
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1

    query = ''' select * from Recipes where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    if len(result) != 1:
        query_lock.release()
        return -2

    # recipe can only edit by creator
    if int(result[0]['created_by_user_id']) != int(u_id):
        query_lock.release()
        return -3

    query_update = '''update RecipeIngredients 
                        set ingredient_name=%s, quantity=%s, unit=%s 
                        where recipe_id=%s and ingredient_no=%s'''
    query_select = '''select * from RecipeIngredients where recipe_id = %s and ingredient_no=%s'''
    query_insert = '''
                    insert into RecipeIngredients(recipe_id, ingredient_no, ingredient_name, quantity, unit)
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
            cur.execute(query_insert, (int(recipe_id), int(index), ingredient['name'], quantity, unit))
        # exist
        else:
            cur.execute(query_update, (ingredient['name'], quantity, unit, int(recipe_id), int(index),))
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

    query_update_edit = ''' update Recipes set edit_time = UTC_TIMESTAMP() where recipe_id = %s'''
    cur.execute(query_update_edit, (int(recipe_id),))
    con.commit()
    query_lock.release()
    return 1


def edit_recipe_steps(token, recipe_id, steps):
    '''
        overwrite all old steps in database by new steps for given recipe
        :param token:
        :param recipe_id: recipe's id in database
        :param steps: new cooking steps of the recipe
        :return:
        -1 for invalid token
        -2 for invalid recipe id
        -3 for inconsistent editor(token) and creator('created_by_user_id' in database)
        1 for success
        '''
    query_lock.acquire()
    cur = con.cursor()
    # get user id from token
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1

    query = ''' select * from Recipes where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()

    if len(result) != 1:
        query_lock.release()
        return -2

    # recipe can only edit by creator
    if int(result[0]['created_by_user_id']) != int(u_id):
        query_lock.release()
        return -3

    query_update = '''update RecipeSteps set step_text=%s where recipe_id=%s and step_no=%s'''
    query_select = '''select * from RecipeSteps where recipe_id = %s and step_no=%s'''
    query_insert = '''
                insert into RecipeSteps(recipe_id, step_no, step_text, step_photo_path)
                values (%s, %s, %s, NULL) 
    '''

    for index, step in enumerate(steps):
        cur.execute(query_select, (int(recipe_id), int(index),))
        result = cur.fetchall()
        # this ingredient_no doesn't exist in database
        if len(result) == 0:
            cur.execute(query_insert, (int(recipe_id), int(index), step['description'],))
        # exist
        else:
            cur.execute(query_update, (step['description'], int(recipe_id), int(index),))

    con.commit()
    query_lock.release()
    return 1