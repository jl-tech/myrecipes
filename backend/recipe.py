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

    created_recipe_id = cur.execute('select LAST_INSERT_ID()')

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
    return 0
