import os

import bcrypt

import helpers
import math
import tokenise
from constants import *

def subscribe(token, user_id):
    '''

    :param token:
    :param user_id:
    :return: -1 invalid token. -2 user to subscribe to not found. -3 already subscribed
    0 success.
    '''
    query_lock.acquire()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1

    cur = con.cursor()
    query = """
        select * from Users where user_id = %s
    """
    cur.execute(query, (user_id,))
    if len(cur.fetchall()) == 0:
        query_lock.release()
        return -2

    query = """
        select * from SubscribedTo where user_id = %s and is_subscribed_to = %s
    """
    cur.execute(query, (u_id, user_id))
    if len(cur.fetchall()) != 0:
        query_lock.release()
        return -3

    query = """
    insert into SubscribedTo
    values (%s, %s)
    """

    cur.execute(query, (u_id, user_id))
    con.commit()

    query = """
        select U.user_id, U.first_name, U.last_name, U.profile_pic_path
        from SubscribedTo S
            join Users U on S.user_id = U.user_id
        where S.is_subscribed_to = %s
    """
    cur.execute(query, (user_id, ))
    result = cur.fetchall()
    
    query_lock.release()
    return result

def unsubscribe(token, user_id):
    '''

    :param token:
    :param user_id:
    :return: -1 invalid token. -2 user to unsubscribe to not found. -3 already
    unsubscribed
    0 success.
    '''
    query_lock.acquire()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1

    cur = con.cursor()
    query = """
            select * from Users where user_id = %s
        """
    cur.execute(query, (user_id,))
    if len(cur.fetchall()) == 0:
        query_lock.release()
        return -2

    query = """
            select * from SubscribedTo where user_id = %s and 
            is_subscribed_to = %s
        """
    cur.execute(query, (u_id, user_id))
    if len(cur.fetchall()) == 0:
        query_lock.release()
        return -3

    query = """
        delete from SubscribedTo where user_id = %s and is_subscribed_to = %s 
        """
    cur.execute(query, (u_id, user_id))
    con.commit()

    query = """
        select U.user_id, U.first_name, U.last_name, U.profile_pic_path
        from SubscribedTo S
            join Users U on S.is_subscribed_to = U.user_id
        where S.user_id = %s
    """
    cur.execute(query, (user_id, ))
    result = cur.fetchall()
    
    query_lock.release()
    return result

def is_subscribed(token, user_id):
    query_lock.acquire()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1
    cur = con.cursor()
    query = """
               select * from SubscribedTo where user_id = %s and 
               is_subscribed_to = %s
           """
    cur.execute(query, (u_id, user_id))
    result = cur.fetchall()
    query_lock.release()
    return len(result) != 0

def get_feed(token, page):
    query_lock.acquire()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1

    cur = con.cursor()
    query = """
        select distinct R.recipe_id,  R.name, R.creation_time, R.edit_time, R.time_to_cook, R.type, R.serving_size, RP.photo_path, R.description, U.first_name, U.last_name, U.profile_pic_path, U.user_id, R.calories
        from Recipes R
            left outer join (select * from RecipePhotos where photo_no = 0) RP on R.recipe_id = RP.recipe_id
            left outer join RecipeIngredients I on R.recipe_id = I.recipe_id
            left outer join RecipeSteps S on I.recipe_id = S.recipe_id
            join Users U on R.created_by_user_id = U.user_id 
        where R.created_by_user_id in (select is_subscribed_to from SubscribedTo where user_id = %s)
        order by DATE(R.creation_time) desc, TIME(R.creation_time) desc-- TODO number of times liked
        limit %s offset %s
    """
    cur.execute(query, (u_id, int(10), int((int(page) - 1) * 10)))
    result = cur.fetchall()

    query = """
        select COUNT(*) 
        from Recipes 
        where created_by_user_id in (select is_subscribed_to from SubscribedTo where user_id = %s)
    """
    cur.execute(query, (u_id, ))
    count = cur.fetchall()

    query_lock.release()
    return result, math.ceil(count[0]['COUNT(*)'] / 10)

def get_subscriptions(token):
    
    query_lock.acquire()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        query_lock.release()
        return -1

    cur = con.cursor()
    query = "select * from Users where user_id = %s"
    cur.execute(query, (u_id,))
    result = cur.fetchall()

    if result[0]['profile_pic_path'] is None:
        result[0]['profile_pic_path'] = DEFAULT_PIC

    query = "select COUNT(*) from Recipes where created_by_user_id = %s"
    cur.execute(query, (u_id,))
    recipe_count = cur.fetchall()
    result[0]['recipe_count'] = recipe_count[0]['COUNT(*)']

    query = """
        select U.user_id, U.first_name, U.last_name, U.profile_pic_path
        from SubscribedTo S
            join Users U on S.user_id = U.user_id
        where S.is_subscribed_to = %s"""
    cur.execute(query, (u_id,))
    subscribers = cur.fetchall()
    result[0]['subscribers'] = subscribers

    query = """
        select U.user_id, U.first_name, U.last_name, U.profile_pic_path
        from SubscribedTo S
            join Users U on S.is_subscribed_to = U.user_id
        where S.user_id = %s
    """
    cur.execute(query, (u_id, ))
    subscriptions = cur.fetchall()
    result[0]['subscriptions'] = subscriptions
    
    query_lock.release()
    return result[0]