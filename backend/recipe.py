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

def add_ingredients(ingredients, quantities, recipe_id):
    '''
    Adds entries in the database so that the specified ingredients are
    associated with the specified recipe_id.
    :param ingredients: array of ingredients
    :param quantities: array of quantities (as string) in the same order as ingredients
    :param recipe_id: the recipe ID of the recipe
    :return: 0 on success.
    '''
    cur = con.cursor()
    if len(ingredients) != len(quantities):
        return -1
    query = '''
            insert into RecipeIngredients(recipe_id, ingredient_no, ingredient_name, quantity)
            values (%s, %s, %s, %s) 
            '''
    for idx, val in ingredients:
        con.execute(query, (int(recipe_id), int(idx), val, quantities[idx]))

    return 0