import os

import bcrypt

import helpers
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
    query_lock.release()
    return 0

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
    query_lock.release()
    return 0

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