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

def add_recipe(token, name, type, time, serving_size, ingredients, steps, photos):
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
        return u_id

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
        cur.execute(query, (int(created_recipe_id), int(index), ingredient['name'], float(ingredient['quantity']), ingredient['unit']))

    # do RecipeSteps table
    query = '''
                insert into RecipeSteps(recipe_id, step_no, step_text, step_photo_path)
                values (%s, %s, %s, NULL) 
    '''
    for index, step in enumerate(steps):
        cur.execute(query, (int(created_recipe_id), int(index), step))


    # do RecipePhotos table
    query = '''
                insert into RecipePhotos(recipe_id, photo_no, photo_path)
                values (%s, %s, %s) 
    '''
    for index, photo in enumerate(photos):
        path = helpers.store_image(photo)
        cur.execute(query, (int(created_recipe_id), int(index), path))

    con.commit()
    query_lock.release()
    return 0

def get_recipe_details(recipe_id):
    '''
    Gets details of a recipe.
    :param recipe_id: the recipe id to get details of
    :return: Dictionary with fields:
        - name: string
        - creation_time: string
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
    query = ''' select * from Recipes where recipe_id = %s'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    if len(result) != 1:
        return -1
    result = result[0]
    out['name'] = result['name']
    out['creation_time'] = result['creation_time']
    out['created_by_user_id'] = result['created_by_user_id']
    out['type'] = result['type']
    out['time_to_cook'] = result['time_to_cook']
    out['serving_size'] = result['serving_size']


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
        out['steps'].append(row['step_text'])

    # photos
    query = '''select * from RecipePhotos where recipe_id = %s order by 
    photo_no'''
    cur.execute(query, (int(recipe_id),))
    result = cur.fetchall()
    out['photos'] = []
    for row in result:
        out['photos'].append(row['photo_path'])

    query_lock.release()
    return out