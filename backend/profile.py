import os

import bcrypt

import helpers
from auth import DEFAULT_PIC, hash_password, send_pwd_change_email, \
    email_already_exists, send_confirm_email
from constants import query_lock, con
from tokenise import token_to_id, token_to_email


def profile_info(user_id):
    '''
    Gets all info associated to a specified user.
    :param user_id: The id of the user
    :return: The tuple containing all fields associated with that user. 1 if
    the user id was not found.
    '''
    query_lock.acquire()
    cur = con.cursor()
    query = "select * from Users where user_id = %s"
    cur.execute(query, (user_id,))
    result = cur.fetchall()

    query_lock.release()
    if len(result) == 0:
        return 1
    else:
        if result[0]['profile_pic_path'] is None:
            result[0]['profile_pic_path'] = DEFAULT_PIC
        return result[0]


def change_password(token, oldpassword, newpassword):
    '''
    Changes the password for the account with the specified email.
    :param email: The email address of the account
    :param oldpassword: The old password
    :param newpassword: The password to change to
    :return: . True on success. False if the old password was incorrect
    '''

    user_id = token_to_id(token)
    email = token_to_email(token)
    if user_id < 0:
        return False, 'Invalid token'

    query_lock.acquire()
    cur = con.cursor()
    query = f"select password_hash from Users where user_id = %s"
    cur.execute(query, (user_id,))
    result = cur.fetchall()

    query_lock.release()
    if bcrypt.checkpw(oldpassword.encode('utf-8'), result[0]['password_hash'].encode('utf-8')):
        new_hash_password = hash_password(newpassword)
        query = 'update Users set password_hash=%s where user_id=%s'
        cur.execute(query, (new_hash_password, user_id))
        con.commit()
        print(email)
        send_pwd_change_email(email)
        return True, ''
    else:
        return False, 'Wrong current password'


def editprofile(token, first_name, last_name):
    user_id = token_to_id(token)

    if user_id < 0:
        return False

    query_lock.acquire()
    cur = con.cursor()
    query = "update Users set first_name = %s, last_name = %s where user_id = %s"
    cur.execute(query, (first_name, last_name, user_id))
    con.commit()

    query_lock.release()
    return True


def changeemail(token, email):
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
    :return: 0 on success. -1 if the token was not valid. -2 on any other error.
    '''
    u_id = token_to_id(token)
    if u_id < 0:
        return -1, ''

    query_lock.acquire()
    cur = con.cursor()
    query = "select profile_pic_path from Users where user_id=%s"
    cur.execute(query, (u_id,))
    old_path = cur.fetchone()['profile_pic_path']

    file_name = helpers.store_image(image_file)

    query = "update Users set profile_pic_path=%s where user_id=%s"
    cur.execute(query, (file_name, u_id))
    con.commit()
    query_lock.release()
    # delete old image
    if old_path is not None:
        try:
            os.remove(old_path)
        except:
            pass

    return 0, file_name


def remove_profile_pic(token):
    '''
    Removes the profile picture for the user associated with the token.
    If a profile picture was previously set, that file will be deleted from
    the profile_pictures folder.
    :param token: The token for the user doing this operation
    :return: 0 on success. -1 if the token was not valid. -2 on any other error.
    '''
    u_id = token_to_id(token)
    if u_id < 0:
        return -1, ''

    query_lock.acquire()
    cur = con.cursor()
    query = "select profile_pic_path from Users where user_id=%s"
    cur.execute(query, (u_id,))
    old_path = cur.fetchone()['profile_pic_path']

    query = "update Users set profile_pic_path=%s where user_id=%s"
    cur.execute(query, (None, u_id))
    con.commit()
    query_lock.release()
    # delete old image
    if old_path is not None:
        try:
            os.remove(old_path)
        except:
            pass

    return 0, DEFAULT_PIC

def get_profile_recipe(user_id):
    query_lock.acquire()
    cur = con.cursor()
    query = "select * from Recipes where created_by_user_id=%s"
    cur.execute(query, (int(user_id)),)
    data = cur.fetchall()
    out = []
    for recipe in data:
        dic = {'name': recipe['name'], 'type': recipe['type'], 'serving_size': recipe['serving_size'],
               'time_to_cook': recipe['time_to_cook'], 'creation_time': recipe['creation_time'],
               'edit_time': recipe['edit_time'], 'recipe_id': recipe['recipe_id']}
        query2 = "select * from RecipePhotos where recipe_id=%s and photo_no=%s"
        cur.execute(query2, (int(recipe['recipe_id']), 0))
        photo = cur.fetchall()
        if len(photo) != 0:
            dic['photo_path'] = photo[0]['photo_path']
        else:
            dic['photo_path'] = None
        out.append(dic)
    query_lock.release()
    return out