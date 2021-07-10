import os

import helpers
import recipe
from constants import *

import bcrypt
import pymysql
import smtplib

import tokenise

import sys

def do_search(name, type, serving_size, ingredients, step_key_words):
    query_lock.acquire()
    cur = con.cursor()

    if name is None:
        name = "%"
    if type is None:
        type = "%"
    if serving_size is None:
        serving_size = "%"

    query = "select * from Recipes where name LIKE %s AND type LIKE %s AND serving_size LIKE %s"
    cur.execute(query, (name, type, serving_size,))
    results = cur.fetchall()

    return_recipe = []

    for result in results:
        recipe_id = result['recipe_id']
        meet_requirement = False

        if len(ingredients) is 0:
            meet_requirement = True
        for ingredient in ingredients:
            query = "select * from RecipeIngredients where recipe_id=%s AND ingredient_name=%s"
            cur.execute(query, (recipe_id, ingredient,))
            if len(cur.fetchall()) != 0:
                meet_requirement = True
                break

        if meet_requirement is False:
            continue

        if len(step_key_words) is 0:
            return_recipe.append(recipe_id)
        for key_word in step_key_words:
            query = "select * from RecipeSteps where recipe_id=%s AND step_text LIKE %s"
            cur.execute(query, (recipe_id, "%"+key_word+"%",))
            if len(cur.fetchall()) != 0:
                return_recipe.append(recipe_id)
                break

    ary = []
    for recipe_id in return_recipe:
        ary.append(recipe.get_recipe_details(recipe_id))

    return ary