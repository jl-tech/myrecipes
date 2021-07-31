import math

import helpers
import tokenise
from auth import DEFAULT_PIC


def subscribe(token, user_id):
    '''
    Subscribes a user given by token to the user given by user_id.
    :param token: The token for the user doing this operation
    :param user_id: user id of specified user
    :returns: -1 invalid token. -2 user to subscribe to not found. -3 already
    subscribed.
    0  on success.
    '''
    con = helpers.get_db_conn()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        con.close()
        return -1

    cur = con.cursor()
    query = """
        select * from Users where user_id = %s
    """
    cur.execute(query, (user_id,))
    if len(cur.fetchall()) == 0:
        con.close()
        return -2

    query = """
        select * from SubscribedTo where user_id = %s and is_subscribed_to = %s
    """
    cur.execute(query, (u_id, user_id))
    if len(cur.fetchall()) != 0:
        con.close()
        return -3

    query = """
    insert into SubscribedTo
    values (%s, %s)
    """

    cur.execute(query, (u_id, user_id))
    con.commit()

    query = """
        select count(*) as subscriber_count
        from SubscribedTo S
            join Users U on S.user_id = U.user_id
        where S.is_subscribed_to = %s
    """
    cur.execute(query, (user_id,))
    result = cur.fetchall()

    con.close()
    return ['user' for i in range(result[0]['subscriber_count'])]


def unsubscribe(token, user_id):
    '''
    Unsubscribes a user given by token from the user given by user_id.
    :param token: The token for the user doing this operation
    :param user_id: user id of specified user
    :returns: -1 invalid token. -2 user to unsubscribe to not found. -3
    already unsubscribed.
    0 on success.
    # TODO fix return value on success.
    '''
    con = helpers.get_db_conn()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        con.close()
        return -1

    cur = con.cursor()
    query = """
            select * from Users where user_id = %s
        """
    cur.execute(query, (user_id,))
    if len(cur.fetchall()) == 0:
        con.close()
        return -2

    query = """
            select * from SubscribedTo where user_id = %s and 
            is_subscribed_to = %s
        """
    cur.execute(query, (u_id, user_id))
    if len(cur.fetchall()) == 0:
        con.close()
        return -3

    query = """
        delete from SubscribedTo where user_id = %s and is_subscribed_to = %s 
        """
    cur.execute(query, (u_id, user_id))
    con.commit()

    query = """
        select count(*) as subscriber_count
        from SubscribedTo S
            join Users U on S.user_id = U.user_id
        where S.is_subscribed_to = %s
    """
    cur.execute(query, (user_id,))
    result = cur.fetchall()

    con.close()
    return ['user' for i in range(result[0]['subscriber_count'])]


def is_subscribed(token, user_id):
    '''
    Checks if a user given by token is subscribed to the user given by user_id.
    :param token: The token for the user doing this operation
    :param user_id: user id of specified user
    :returns: -1 invalid token. Boolean on success.
    '''
    con = helpers.get_db_conn()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        con.close()
        return -1
    cur = con.cursor()
    query = """
               select * from SubscribedTo where user_id = %s and 
               is_subscribed_to = %s
           """
    cur.execute(query, (u_id, user_id))
    result = cur.fetchall()
    con.close()
    return len(result) != 0


def get_feed(token, page):
    '''
    Get news feed of user with given token
    :param token: The token for the user doing this operation
    :param page: amount of pages
    :returns: -1 if invalid token, otherwise news feed and total pages
    '''
    sub = 8
    rec = 2

    con = helpers.get_db_conn()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        con.close()
        return -1

    cur = con.cursor()
    query = """
        select distinct R.recipe_id, R.name, R.creation_time, R.edit_time,
            R.time_to_cook, R.type, R.serving_size, RP.photo_path, 
            R.description,
            U.first_name, U.last_name, COALESCE(U.profile_pic_path, '""" + \
            DEFAULT_PIC + """') as profile_pic_path,
            U.user_id, R.calories, (select count(*) from Likes L where 
            R.recipe_id = L.recipe_id) as likes,
            (select count(*) from Comments C where R.recipe_id = C.recipe_id) 
            as comments
        from Recipes R
            left outer join (select * from RecipePhotos where photo_no = 0) 
            RP on R.recipe_id = RP.recipe_id
            join Users U on R.created_by_user_id = U.user_id 
        where R.created_by_user_id in (select is_subscribed_to from 
        SubscribedTo where user_id = %s)
        order by DATE(R.creation_time) desc, (select count(*) from Likes L 
        where R.recipe_id = L.recipe_id) desc, TIME(R.creation_time) desc
        limit %s offset %s
    """
    cur.execute(query, (u_id, int(sub), int((int(page) - 1) * sub)))
    result = cur.fetchall()

    query = """
        select COUNT(*) 
        from Recipes 
        where created_by_user_id in (select is_subscribed_to from 
        SubscribedTo where user_id = %s)
    """
    cur.execute(query, (u_id,))
    count = cur.fetchall()
    total_pages = math.ceil(count[0]['COUNT(*)'] / sub)
    con.close()

    result2 = get_recommendations(u_id, page, rec)
    if (len(result2) == 0):
        return result, total_pages

    h1 = result[:len(result) // 2]
    h2 = result[len(result) // 2:]
    g1 = result2[:len(result2) // 2]
    g2 = result2[len(result2) // 2:]
    result3 = []
    for i in range(len(result2)):
        result3 = result3 + result[
                            len(result) // len(result2) * i:len(result) // len(
                                result2) * (i + 1)]
        result3 = result3 + [result2[i]]
    result3 = result3 + result[len(result) // len(result2) * len(result2):]

    return result3, total_pages


def get_subscriptions(token):
    '''
    Gets subscriptions of user with given token
    :param token: The token for the user doing this operation
    :returns: -1 if invalid token, otherwise subscriptions
    '''

    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        return -1

    con = helpers.get_db_conn()
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
        select U.user_id, U.first_name, U.last_name,
            COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """') as 
            profile_pic_path
        from SubscribedTo S
            join Users U on S.user_id = U.user_id
        where S.is_subscribed_to = %s"""
    cur.execute(query, (u_id,))
    subscribers = cur.fetchall()
    result[0]['subscribers'] = subscribers

    query = """
        select U.user_id, U.first_name, U.last_name,
            COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """') as 
            profile_pic_path
        from SubscribedTo S
            join Users U on S.is_subscribed_to = U.user_id
        where S.user_id = %s
    """
    cur.execute(query, (u_id,))
    subscriptions = cur.fetchall()
    result[0]['subscriptions'] = subscriptions

    con.close()
    return result[0]


def get_recommendations(u_id, page, rec):
    '''
    Finds recipe recommendations for the user given by u_id.
    :param u_id:
    :param page:
    :param rec:
    :returns: Array of recipes.
    # TODO Clarify this documentation.
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    query = """
        select distinct R.recipe_id, R.name, R.creation_time, R.edit_time,
            R.time_to_cook, R.type, R.serving_size, RP.photo_path, 
            R.description,
            U.first_name, U.last_name, COALESCE(U.profile_pic_path, '""" + \
            DEFAULT_PIC + """') as profile_pic_path,
            U.user_id, R.calories, (select count(*) from Likes L where 
            R.recipe_id = L.recipe_id) as likes,
            (select count(*) from Comments C where R.recipe_id = C.recipe_id) 
            as comments, TRUE as recommended, S.time
        from Recipes R
            left outer join (select * from RecipePhotos where photo_no = 0) 
            RP on R.recipe_id = RP.recipe_id
            join Users U on R.created_by_user_id = U.user_id 
            right outer join SearchHistory S on R.name like concat(%s, 
            S.search_term, %s)
        where R.created_by_user_id not in (select is_subscribed_to from 
        SubscribedTo where user_id = %s)
            and R.created_by_user_id <> %s
        order by DATE(S.time) desc, DATE(R.creation_time) desc, (select 
        count(*) from Likes L where R.recipe_id = L.recipe_id) desc, 
        TIME(R.creation_time) desc
        limit %s offset %s
    """
    cur.execute(query,
                ('%', '%', u_id, u_id, int(rec), int((int(page) - 1) * rec)))
    result = cur.fetchall()

    con.close()
    return result
