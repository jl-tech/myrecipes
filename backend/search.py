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

    query = """
        select distinct R.recipe_id,  R.name, R.creation_time, R.edit_time, R.time_to_cook, R.type, R.serving_size
        from Recipes R
            join RecipeIngredients I on R.recipe_id = I.recipe_id
            join RecipeSteps S on I.recipe_id = S.recipe_id     
        """

    and_needed = False
    args = tuple()

    if name is not None or type is not None or serving_size is not None or ingredients is not None or step_key_words is not None:
        query += "where "

    if name is not None:
        query += "match(R.name) against(%s in natural language mode) "
        args = args + (name,)
        and_needed = True

    if type is not None:
        if and_needed:
            query += "AND "
        else:
            and_needed = True

        query += "type = %s "
        args = args + (type,)

    if serving_size is not None:
        if and_needed:
            query += "AND "
        else:
            and_needed = True

        query += "serving_size = %s "

        args = args + (int(serving_size),)

    if ingredients is not None:
        if and_needed:
            query += "AND "
        else:
            and_needed = True
        query += "match(I.ingredient_name) against (%s in natural language " \
                 "mode) "
        args = args + (ingredients,)

    if step_key_words is not None:
        if and_needed:
            query += "AND "
        query += "match(S.step_text) against (%s in natural language mode)"
        args = args + (step_key_words,)

    print(query)
    print(args)
    cur.execute(query, args)
    results = cur.fetchall()

    # return_recipe = []
    #
    # for result in results:
    #     recipe_id = result['recipe_id']
    #     meet_requirement = False
    #
    #     if len(ingredients) is 0:
    #         meet_requirement = True
    #     for ingredient in ingredients:
    #         query = "select * from RecipeIngredients where recipe_id=%s AND ingredient_name=%s"
    #         cur.execute(query, (recipe_id, ingredient,))
    #         if len(cur.fetchall()) != 0:
    #             meet_requirement = True
    #             break
    #
    #     if meet_requirement is False:
    #         continue
    #
    #     if len(step_key_words) is 0:
    #         return_recipe.append(recipe_id)
    #     for key_word in step_key_words:
    #         query = "select * from RecipeSteps where recipe_id=%s AND match(step_text) against(%s in natural language mode)
    #         cur.execute(query, (recipe_id, "%"+key_word+"%",))
    #         if len(cur.fetchall()) != 0:
    #             return_recipe.append(recipe_id)
    #             break
    #
    # ary = []
    # for recipe_id in return_recipe:
    #     new = recipe.get_recipe_details(recipe_id)
    #     new['recipe_id'] = recipe_id
    #     ary.append(new)

    query_lock.release()
    return results
