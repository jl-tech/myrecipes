"""
This file contains functions associated with profile and profile management
including
    - getting a user's details
    - changing name
    - changing username
    - changing password
"""
import os
import bcrypt
import helpers
from auth import DEFAULT_PIC, hash_password, send_pwd_change_email, \
    email_already_exists, send_confirm_email
from tokenise import token_to_id, token_to_email


def profile_info(token, user_id):
    '''
    Gets all info associated to a specified user.
    :param token: token of the user doing this operation
    :param user_id: The id of the specified user
    :returns: The tuple containing all fields associated with that user. 1 if
    the user id was not found.
    '''
    requester = token_to_id(token)

    con = helpers.get_db_conn()
    cur = con.cursor()
    query = "select * from Users where user_id = %s"
    cur.execute(query, (user_id,))
    result = cur.fetchall()

    if len(result) == 0:
        con.close()
        return 1
    else:
        if result[0]['profile_pic_path'] is None:
            result[0]['profile_pic_path'] = DEFAULT_PIC

        query = "select COUNT(*) from Recipes where created_by_user_id = %s"
        cur.execute(query, (user_id,))
        recipe_count = cur.fetchall()
        result[0]['recipe_count'] = recipe_count[0]['COUNT(*)']

        if requester == int(user_id):
            query = "select U.user_id, U.first_name, U.last_name, COALESCE(" \
                    "U.profile_pic_path, '" + DEFAULT_PIC + "') as " \
                                                            "profile_pic_path " \
                                                            "from " \
                                                            "SubscribedTo S " \
                                                            "join Users U on " \
                                                            "S.user_id = " \
                                                            "U.user_id where " \
                                                            "S.is_subscribed_to = %s"
            cur.execute(query, (user_id,))
            subscribers = cur.fetchall()
            result[0]['subscribers'] = subscribers
        else:
            query = "select count(*) as subscriber_count from SubscribedTo S " \
                    "join Users U on S.user_id = U.user_id where " \
                    "S.is_subscribed_to = %s"
            cur.execute(query, (user_id,))
            subscribers = cur.fetchall()
            result[0]['subscribers'] = ['user' for i in range(
                subscribers[0]['subscriber_count'])]

        if requester == int(user_id):
            query = "select U.user_id, U.first_name, U.last_name, COALESCE(" \
                    "U.profile_pic_path, '" + DEFAULT_PIC + "') as " \
                                                            "profile_pic_path " \
                                                            "from " \
                                                            "SubscribedTo S " \
                                                            "join Users U on " \
                                                            "S.is_subscribed_to = U.user_id where S.user_id = %s"
            cur.execute(query, (user_id,))
            subscriptions = cur.fetchall()
            result[0]['subscriptions'] = subscriptions

        else:
            result[0]['subscriptions'] = []

        con.close()
        return result[0]


def change_password(token, oldpassword, newpassword):
    '''
    Changes the password for the account with given token.
    :param token: token of the user doing this operation
    :param oldpassword: The old password
    :param newpassword: The password to change to
    :returns: True on success. False if the old password was incorrect
    '''

    user_id = token_to_id(token)
    email = token_to_email(token)
    if user_id < 0:
        return False, 'Invalid token'

    con = helpers.get_db_conn()
    cur = con.cursor()
    query = f"select password_hash from Users where user_id = %s"
    cur.execute(query, (user_id,))
    result = cur.fetchall()

    if bcrypt.checkpw(oldpassword.encode('utf-8'),
                      result[0]['password_hash'].encode('utf-8')):
        new_hash_password = hash_password(newpassword)
        query = 'update Users set password_hash=%s where user_id=%s'
        cur.execute(query, (new_hash_password, user_id))
        con.commit()
        send_pwd_change_email(email)
        return True, ''
    else:
        return False, 'Wrong current password'


def editprofile(token, first_name, last_name):
    '''
    Change the first name and last name for the account with given token
    :param token: token of the user doing this operation
    :param first_name: new first name
    :param last_name: new last name
    :returns: True for success, False for invalid token
    '''
    user_id = token_to_id(token)
    if user_id < 0:
        return False

    con = helpers.get_db_conn()
    cur = con.cursor()
    query = "update Users set first_name = %s, last_name = %s where user_id = " \
            "%s"
    cur.execute(query, (first_name, last_name, user_id))
    con.commit()

    con.close()
    return True


def changeemail(token, email):
    '''
    Change the email address for the account with given token
    :param token: token of the user doing this operation
    :param email: new email adress
    :returns: True if success, False if token is invalid or email address is
    already used by other user
    '''
    user_id = token_to_id(token)

    if user_id < 0:
        return False, "Invalid token"

    if email_already_exists(email):
        return False, "Email already exists"

    send_confirm_email(user_id, email)
    return True, ""


def change_profile_pic(image_file, token):
    '''
    Changes the profile picture for the user associated with the token.
    Does so by creating a file in root/server_resources/images/profile_pictures
    and updating the database with that URL.
    If a profile picture was previously set, that file will be deleted from
    the profile_pictures folder.
    :param image_file: The image file of the profile picture
    :param token: The token for the user doing this operation
    :returns: 0 on success. -1 if the token was not valid. -2 on any other
    error.
    '''
    u_id = token_to_id(token)
    if u_id < 0:
        return -1, ''

    con = helpers.get_db_conn()
    cur = con.cursor()
    query = "select profile_pic_path from Users where user_id=%s"
    cur.execute(query, (u_id,))
    old_path = cur.fetchone()['profile_pic_path']

    file_name = helpers.store_image(image_file)

    query = "update Users set profile_pic_path=%s where user_id=%s"
    cur.execute(query, (file_name, u_id))
    con.commit()
    con.close()
    # delete old image
    if old_path is not None:
        try:
            os.remove("./static/server_resources/images/" + old_path)
        except:
            pass

    return 0, file_name


def remove_profile_pic(token):
    '''
    Removes the profile picture for the user associated with the token.
    If a profile picture was previously set, that file will be deleted from
    the profile_pictures folder.
    :param token: The token for the user doing this operation
    :returns: 0 on success. -1 if the token was not valid. -2 on any other
    error.
    '''
    u_id = token_to_id(token)
    if u_id < 0:
        return -1, ''

    con = helpers.get_db_conn()
    cur = con.cursor()
    query = "select profile_pic_path from Users where user_id=%s"
    cur.execute(query, (u_id,))
    old_path = cur.fetchone()['profile_pic_path']

    query = "update Users set profile_pic_path=%s where user_id=%s"
    cur.execute(query, (None, u_id))
    con.commit()
    con.close()
    # delete old image
    if old_path is not None:
        try:
            os.remove(old_path)
        except:
            pass

    return 0, DEFAULT_PIC


def get_profile_recipe(user_id):
    '''
    Gets all recipes created by given user_id
    :param user_id: the user id of specified user
    :returns: details of all recipes created by given user_id
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    query = """
                select R.*, U.first_name, U.last_name,
                    COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """"') 
                    as profile_pic_path,
                    U.user_id, (select count(*) from Likes L where 
                    R.recipe_id = L.recipe_id) as likes,
                    (select count(*) from Comments C where R.recipe_id = 
                    C.recipe_id) as comments,
                    RP.photo_path
                from Recipes R
                    join Users U on U.user_id = R.created_by_user_id
                    left outer join (select * from RecipePhotos where 
                    photo_no = 0) RP on R.recipe_id = RP.recipe_id
                where created_by_user_id=%s
                order by creation_time desc
            """
    cur.execute(query, (int(user_id)), )
    data = cur.fetchall()
    con.close()
    return data


def get_profile_recipe_liked(token, user_id):
    '''
    Gets details of recipes liked by user with given token and created by
    specified user with given user_id
    :param token: The token for the user doing this operation
    :param user_id: user id for specified user
    :returns: -1 for invalid token, otherwise details of recipes
    '''
    u_id = token_to_id(token)
    if u_id < 0:
        return -1

    con = helpers.get_db_conn()
    cur = con.cursor()
    query = """
                select R.*, U.first_name, U.last_name,
                    COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """"') 
                    as profile_pic_path,
                    U.user_id, (select count(*) from Likes L where 
                    R.recipe_id = L.recipe_id) as likes,
                    (select count(*) from Comments C where R.recipe_id = 
                    C.recipe_id) as comments,
                    RP.photo_path
                from Recipes R
                    join Users U on U.user_id = R.created_by_user_id
                    left outer join (select * from RecipePhotos where 
                    photo_no = 0) RP on R.recipe_id = RP.recipe_id
                    join Likes L on R.recipe_id = L.recipe_id
                where created_by_user_id=%s and liked_by_user_id=%s
                order by creation_time desc
            """
    cur.execute(query, (int(user_id), int(u_id)), )
    data = cur.fetchall()
    con.close()
    return data


def get_times_liked(token, user_id):
    '''
    Gets number of likes for all recipes created by specified user
    :param token: token of the user doing this operation
    :param user_id: user id of specified user
    :returns: -1 for invalid token, otherwise number of likes for all recipes
    created by specified user
    '''
    if token_to_id(token) < 0:
        return -1

    con = helpers.get_db_conn()
    cur = con.cursor()
    query = "select * from Likes INNER JOIN Recipes ON Recipes.recipe_id = " \
            "Likes.recipe_id where Recipes.created_by_user_id=%s"
    cur.execute(query, (int(user_id),))
    result = cur.fetchall()

    con.close()
    return len(result)


def get_profile_recipe_profileuser_liked(user_id):
    '''
    Gets details of recipes like by user with given user id
    :param user_id: user id of specified user
    :returns: details of recipes
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    query = """
                select R.*, U.first_name, U.last_name,
                    COALESCE(U.profile_pic_path, '""" + DEFAULT_PIC + """"') 
                    as profile_pic_path,
                    U.user_id, (select count(*) from Likes L where 
                    R.recipe_id = L.recipe_id) as likes,
                    (select count(*) from Comments C where R.recipe_id = 
                    C.recipe_id) as comments,
                    RP.photo_path
                from Recipes R
                    join Users U on U.user_id = R.created_by_user_id
                    left outer join (select * from RecipePhotos where 
                    photo_no = 0) RP on R.recipe_id = RP.recipe_id
                    join Likes L on R.recipe_id = L.recipe_id
                where liked_by_user_id=%s
                order by creation_time desc
            """
    cur.execute(query, (int(user_id)), )
    data = cur.fetchall()
    con.close()
    return data


def get_comments(user_id):
    '''
    Gets all comments posted by specified user
    :param user_id: user id of specified user
    :returns: all comments posted by specified user
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    query = """
        select * 
        from Comments C join Recipes R on C.recipe_id = R.recipe_id 
        join Users U on R.created_by_user_id = U.user_id
        left outer join RecipePhotos RP on R.recipe_id = RP.recipe_id and 
        RP.photo_no = 0
        where C.by_user_id=%s
        order by C.time_created desc
    """
    cur.execute(query, (user_id,))
    result = cur.fetchall()
    con.close()
    return result


def find_user(name):
    '''
    Finds all users with given 'name' parameter as their first or last name
    :param name: first or last name for search
    :returns: details of all found users
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()
    query = """
            select user_id, first_name, last_name, profile_pic_path,
                match(first_name) against (%s in natural language mode) as 
                F_relevance,
                match(last_name) against (%s in natural language mode) as 
                L_relevance
            from Users
            where match(first_name) against (%s in natural language mode) 
                or match(last_name) against (%s in natural language mode)
            order by F_relevance + L_relevance  desc
            limit 50
        """
    cur.execute(query, (name, name, name, name))
    result = cur.fetchall()
    con.close()
    return result
