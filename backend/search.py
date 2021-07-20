import os

import helpers
import recipe
from constants import *

import bcrypt
import pymysql
import smtplib

import tokenise

import sys

import time
from datetime import datetime
from auth import DEFAULT_PIC


def do_search(name, type, serving_size, time_to_cook, ingredients, step_key_words):
    query_lock.acquire()
    cur = con.cursor()

    query = """
        select distinct R.recipe_id, R.name, R.creation_time, R.edit_time,
            R.time_to_cook, R.type, R.serving_size, RP.photo_path, R.description,
            U.first_name, U.last_name, COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """') as profile_pic_path,
            U.user_id, R.calories
        from Recipes R
            left outer join (select * from RecipePhotos where photo_no = 0) RP on R.recipe_id = RP.recipe_id
            left outer join RecipeIngredients I on R.recipe_id = I.recipe_id
            left outer join RecipeSteps S on I.recipe_id = S.recipe_id
            join Users U on R.created_by_user_id = U.user_id 
        """

    and_needed = False
    args = tuple()

    if name is not None or type is not None or serving_size is not None or time_to_cook is not None or ingredients is not None or step_key_words is not None:
        query += "where "

    if name is not None:
        query += "match(R.name) against (%s in natural language mode) "
        query = query.replace("select distinct", "select distinct match(R.name) against (%s in natural language mode) as name_relevance, ")
        # query += "R.name like %s "
        args = args + (name, name,)
        # args = args + ('%'+name+'%',)
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

    if time_to_cook is not None:
        if and_needed:
            query += "AND "
        else:
            and_needed = True

        query += "time_to_cook = %s "

        args = args + (int(time_to_cook),)

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

    order_by_needed = True
    if name is not None:
        query += "ORDER BY "
        order_by_needed = False
        query += "name_relevance desc"

    cur.execute(query, args)
    results = cur.fetchall()
    if isinstance(results, tuple):
        results = []
    query_lock.release()

    ## Stage 2: include name matches for ingredients
    # Sorts by number of ingredients which contain the name
    if name is not None:
        query_lock.acquire()
        query = """
        select count(*), R.recipe_id, R.name, R.creation_time, R.edit_time,
            R.time_to_cook, R.type, R.serving_size, RP.photo_path, R.description,
            U.first_name, U.last_name, COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """') as profile_pic_path,
            U.user_id, R.calories
        from Recipes R
            left outer join (select * from RecipePhotos where photo_no = 0) RP on R.recipe_id = RP.recipe_id
            left outer join RecipeIngredients I on R.recipe_id = I.recipe_id
            join Users U on R.created_by_user_id = U.user_id 
        where match(I.ingredient_name) against (%s in natural language mode)
        group by R.recipe_id
        order by count(*) desc
        """
        cur.execute(query, (name,))
        result2= cur.fetchall()
        query_lock.release()
        for result in result2:
            is_not_duplicate = True
            for r in results:
                if result['recipe_id'] == r['recipe_id']:
                    is_not_duplicate = False
                    break
            if is_not_duplicate:
                results.append(result)

        ## Stage 3: include name matches for steps
        # Sorts by number of steps which contain the name
        if name is not None:
            query_lock.acquire()
            query = """
            select count(*), R.recipe_id, R.name, R.creation_time, R.edit_time,
                R.time_to_cook, R.type, R.serving_size, RP.photo_path, R.description,
                U.first_name, U.last_name, COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """') as profile_pic_path,
                U.user_id, R.calories
            from Recipes R
                left outer join (select * from RecipePhotos where photo_no = 0) RP on R.recipe_id = RP.recipe_id
                left outer join RecipeSteps S on R.recipe_id = S.recipe_id
                join Users U on R.created_by_user_id = U.user_id 
            where match(S.step_text) against (%s in natural language mode)
            group by R.recipe_id
            order by count(*) desc
            """
            cur.execute(query, (name,))
            result2 = cur.fetchall()
            query_lock.release()
            for result in result2:
                is_not_duplicate = True
                for r in results:
                    if result['recipe_id'] == r['recipe_id']:
                        is_not_duplicate = False
                        break
                if is_not_duplicate:
                    results.append(result)

    return results


def add_search_history(token, name, ingredients, step):
    query_lock.acquire()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1


    cur = con.cursor()


    if name is not None:
        term = name
    elif ingredients is not None:
        term = ingredients
    elif step is not None:
        term = step
    else:
        query_lock.release()
        return

    query = ''' select * from SearchHistory where search_term = %s and user_id = %s'''
    cur.execute(query, (term, int(u_id)))
    if len(cur.fetchall()) > 0:
        query = '''update SearchHistory set time=UTC_TIMESTAMP() where search_term = %s and user_id = %s '''
        cur.execute(query, (term, int(u_id)))
    else:
        query = '''
                insert into SearchHistory(user_id, time, search_term) 
            values (%s, UTC_TIMESTAMP(), %s)
        '''
        cur.execute(query, (int(u_id), term,))

    auto_update_search_history(token)

    con.commit()
    query_lock.release()


def get_search_history(token):
    query_lock.acquire()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return []

    query = """
        select search_term, time
        from SearchHistory
        where user_id=%s
        order by time desc
    """
    cur = con.cursor()
    cur.execute(query, (u_id,))
    result = cur.fetchall()
    query_lock.release()
    return result


def delete_search_history(token, search_term, time):
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1

    query_lock.acquire()
    cur = con.cursor()

    query = '''delete from SearchHistory where user_id=%s and search_term=%s and time=%s'''
    cur.execute(query, (int(u_id), search_term, time,))

    con.commit()
    query_lock.release()
    return 0


'''
update the search history table to ensure only 10 history records
'''
def auto_update_search_history(token):
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        return -1


    cur = con.cursor()

    query = '''select * from SearchHistory where user_id=%s order by time'''

    cur.execute(query, (int(u_id),))
    result = cur.fetchall()

    if len(result) <= 10:
        return 0

    search_term = result[0]['search_term']
    time = result[0]['time']

    query = '''delete from SearchHistory where user_id=%s and search_term=%s and time=%s'''
    cur.execute(query, (int(u_id), search_term, time,))

    con.commit()
    return 0
