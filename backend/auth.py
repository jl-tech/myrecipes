import random
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

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

import threading

def add_new_user(email, first_name, last_name, password):
    '''
    Adds a new user to the database, and sends a confirmation email providing
    the email verification code.
    :param email:
    :param first_name:
    :param last_name:
    :param password:
    :return: 0 success, the confirmation code for email verification.
    -1 if the email already exists.
    -2 if the password didn't meet the password requirements.
    -3 for any other error.
    '''
    if email_already_exists(email):
        return 1

    # TODO password requirements?

    hashed_pwd = hash_password(password)
    cur = con.cursor()
    query = "insert into Users (email, first_name, last_name, password_hash, email_verified)" \
            "values (%s, %s, %s, %s, FALSE)"
    cur.execute(query, (email, first_name, last_name, hashed_pwd))
    con.commit()

    query = "select user_id from Users where email = %s"
    cur.execute(query, (email))
    user_id = cur.fetchone()

    email_thread = threading.Thread(name="conf_email_thread",
                                    args=(user_id['user_id'], email),
                                    target=send_confirm_email)
    email_thread.start()

    print(f"INFO: Created new account: {email}, f: {first_name}, l: {last_name}, p: {hashed_pwd}")
    return 0

def email_confirm(code):
    '''
    Given an email verification token, updates the user email associated with user_id
    an unverified account, and verifies that account if so.
    :param code: The email verification token
    :return: 0 on success. 1 if token is unsecure
    '''

    data = tokenise.decode_token(code)
    if data is None:
        return 1

    cur = con.cursor()
    print(data)
    query = "update Users set email = %s, email_verified = TRUE where user_id = %s"
    changed_rows = cur.execute(query, (data["email"], int(data["user_id"])))
    con.commit()

    if changed_rows == 0:
        return 1
    else:
        return 0

def verify(token):
    user_id = token_to_id(token)
    
    print(user_id, file=sys.stderr)
    if user_id < 0:
        return None

    return user_id

def token_to_id(token):
    '''
    Given a jwt token, decodes that token into the user id corresponding
    to the token's account
    :param token: The token to decode
    :return: The id of the account on success.
    -1 if the token couldn't be decoded
    -2 if the id decoded is not associated with an account
    -3 if the email of the account decoded hasn't been verified
    '''
    if token is None:
        return -1

    token_decoded = tokenise.decode_token(token)
    if token_decoded is None:
        return -1

    if 'user_id' not in token_decoded:
        return -1
    user_id = token_decoded['user_id']
    print(user_id, file=sys.stderr)

    cur = con.cursor()
    # check email exists with an account
    query = "select * from Users where user_id = %s"
    cur.execute(query, (user_id,))
    result = cur.fetchall()
    if len(result) == 0:
        return -2
    query = "select * from Users where user_id = %s and email_verified = %s"
    cur.execute(query, (user_id, True, ))
    result = cur.fetchall()
    if len(result) == 0:
        return -3
    return user_id

def token_to_email(token):
    '''
    Given a jwt token, decodes that token into the user id corresponding
    to the token's account, and then gets the email associated with that account.
    :param token: The token to decode
    :return: The email address of the account on success.
    -1 if the token couldn't be decoded
    -2 if the id decoded is not associated with an account
    -3 if the email decoded hasn't been verified
    '''
    id = token_to_id(token)
    if id == -1 or id == -2 or id == -3:
        return id

    cur = con.cursor()
    query = 'select email from Users where user_id = %s'
    cur.execute(query, (id,))
    return cur.fetchone()['email']



def hash_password(password):
    '''
    Hashes a password so it can be stored in the database securely.
    This function will use a salt which is randomly generated.
    :param password: The password to hash
    :return: The hashed password which can be stored safely in the database
    '''
    pword_bytes = password.encode('utf-8')
    return bcrypt.hashpw(pword_bytes, bcrypt.gensalt()).decode('utf-8')

def check_password(email, password):
    '''
    Checks whether the provided password is the correct password for the
    account with the specified email.
    :param email: The email address of the account
    :param password: The password to check
    :return: (True, user_id) if the password was correct.
    (False, -1) if not. (False, -2) if the email wasn't found.
    (False, -3) if the email hasn't been verified, but the combination was correct.
    '''
    cur = con.cursor()
    query = f"select user_id, password_hash from Users where email = %s"
    cur.execute(query, (email,))
    result = cur.fetchall()
    if len(result) == 0:
        return False, -2
    p_hash = result[0]['password_hash']
    correct = bcrypt.checkpw(password.encode('utf-8'), p_hash.encode('utf-8'))
    if not correct:
        return False, -1
    query = f"select email_verified from Users where user_id = %s"
    cur.execute(query, (result[0]['user_id'],))
    is_verified = cur.fetchall()[0]['email_verified']
    print(is_verified)
    if not is_verified:
        return False, -3
    return True, result[0]['user_id']


def email_already_exists(email):
    '''
    Checks whether a user with this email already exists in the database.
    :param email: The email address to check
    :return: True if the email already exists. False otherwise.
    '''
    cur = con.cursor()
    query = f"select * from Users where email = %s"
    cur.execute(query, (email,))
    result = cur.fetchall()
    if len(result) != 0:
        return True
    else:
        return False

def send_confirm_email(user_id, email):
    '''
    Sends the email requesting the user to confirm their email to the
    specified email address
    :param user_id: The id associated with the user
    :param email: The email address to send to
    :return: 0 on success. 1 on any error.
    '''

    # Variables setup
    code = tokenise.encode_token({'user_id': user_id, 'email': email})

    subject = "Confirm your email for MyRecipes"

    message_plain = f"""\
       Hi!

       Please click the link below to confirm your email.
       http://localhost:3000/emailconfirm?code={code}
       
       If the link doesn't work, the code to confirm your email is {code}.

       If you did not sign up, you do not need to do anything.

       Regards,
       MyRecipes
       """

    message_html = f"""\
           <html>
               <body>
                   <p> Hi! </p>

                   <b> <p> Please click the link below to confirm your email.</p>
                    <p> http://localhost:3000/emailconfirm?code={code}</p> </b>
       
                    <p> If the link doesn't work, the code to reset your email is {code}. </p>

                    <p> If you did not sign up, you do not need to do anything. </p>

                    <p> Regards, </p>
                    <p> MyRecipes </p>
               </body>
           </html>
           """

    email_thread = threading.Thread(name="email_thread",
                                    args=(subject, message_html, message_plain, email),
                                    target=helpers.send_email)
    email_thread.start()


    return 0


def send_reset(email):
    '''
    Sends the email containing the link and code to reset password.
    The
    :param email: The email address to send to
    :return: 0 on success. 1 if the email is not associated with an account.
    '''

    cur = con.cursor()
    query = 'select password_hash from Users where email = %s'
    cur.execute(query, (email,))

    result = cur.fetchall()
    if len(result) == 0:
        return 1
    code = tokenise.encode_token({'password': result[0]['password_hash']})

    # Variables setup

    subject = "Your password reset link for MyRecipes"
    message_plain = f"""\
       Hi!

       Someone (hopefully you) requested to change your password for MyRecipes.

       Please click the link below to change your password.
       http://localhost:3000/resetpassword?code={code}

       If the link doesn't work, the code to reset your password is {code}.

       If you did not request this change you do not need to do anything.

       Regards,
       MyRecipes
       """
    message_html = f"""\
           <html>
               <body>
                   <p> Hi! </p>

                   <p>  Someone (hopefully you) requested to change your password for MyRecipes. </p>

                   <b> <p> Please click the link below to change your 
                   password.</p>
                    <p> http://localhost:3000/reset?code={code}</p> </b>

                    <p> If the link doesn't work, the code to reset your 
                    password is {code}. </p>

                    <p> If you did not request this change you do not need to do anything. </p>

                    <p> Regards, </p>
                    <p> MyRecipes </p>
               </body>
           </html>
           """
    email_thread = threading.Thread(name="email_thread",
                                    args=(subject, message_html, message_plain,
                                          email),
                                    target=helpers.send_email)
    email_thread.start()
    return 0

def reset_password(reset_code, password):
    '''
    Given a reset code, checks that code is valid, and then changes the
    password for the user account associated with that user code.
    :param reset_code: The reset code
    :param password: The new password
    :return: 0 on success. 1 if the token is not valid in any way.
    '''
    cur = con.cursor()
    decoded = tokenise.decode_token(reset_code)
    if decoded is None:
        return 1
    if 'password' not in decoded:
        return 1

    password_hash = decoded['password']

    cur = con.cursor()
    query = 'select email from Users where password_hash = %s'
    cur.execute(query, (password_hash,))

    result = cur.fetchall()
    if len(result) == 0:
        return 1

    email_of_acc = result[0]['email']
    new_pwd_hash = hash_password(password)
    query = 'update Users set password_hash=%s where email=%s'
    cur.execute(query, (new_pwd_hash, email_of_acc))
    con.commit()
    email_thread = threading.Thread(name="conf_email_thread",
                                    args=(email_of_acc,),
                                    target=send_pwd_change_email)
    email_thread.start()


    return 0

def verify_reset_code(reset_code):
    '''
    Given a reset code, checks that code is valid
    :param reset_code: The reset code
    :return: 0 on success. 1 if the token is not valid in any way.
    '''
    cur = con.cursor()
    decoded = tokenise.decode_token(reset_code)
    if decoded is None:
        return 1
    if 'password' not in decoded:
        return 1

    password_hash = decoded['password']

    cur = con.cursor()
    query = 'select email from Users where password_hash = %s'
    cur.execute(query, (password_hash,))

    result = cur.fetchall()
    if len(result) == 0:
        return 1

    return 0

def send_pwd_change_email(email):
    # Send email to notify user
    # Variables setup

    subject = "Your password was changed for MyRecipes"
    message_plain = f"""\
        Hi,

        This email is to inform you that your password was changed.

        If you didn't expect this, contact customer support immediately.

        Regards,
        MyRecipes
              """
    message_html =f"""\
        <p> Hi,</p>

        <p> This email is to inform you that your password was changed.</p>

        <p> If you didn't expect this, contact customer support immediately.</p>

        <p> Regards, </p>
        <p> MyRecipes </p>
        """
    email_thread = threading.Thread(name="conf_email_thread",
                                    args=(email,),
                                    target=send_pwd_change_email)
    email_thread.start()


def profile_info(user_id):
    '''
    Gets all info associated to a specified user.
    :param user_id: The id of the user
    :return: The tuple containing all fields associated with that user. 1 if
    the user id was not found.
    '''
    cur = con.cursor()
    query = "select * from Users where user_id = %s"
    cur.execute(query, (user_id,))
    result = cur.fetchall()
    if len(result) == 0:
        return 1
    else:
        return result[0]

def change_password(email, oldpassword, newpassword):
    '''
    Changes the password for the account with the specified email.
    :param email: The email address of the account
    :param oldpassword: The old password
    :param newpassword: The password to change to
    :return: . True on success. False if the old password was incorrect
    '''
    cur = con.cursor()
    if not check_password(email, oldpassword)[0]:
        return False
    else:
        new_hash_password = hash_password(newpassword)
        query = 'update Users set password_hash=%s where email=%s'
        cur.execute(query, (new_hash_password, email))
        con.commit()
        return True

def editprofile(token, first_name, last_name):
    email = token_to_email(token)
    
    if isinstance(email, int): 
        return False

    cur = con.cursor()
    query = "update Users set first_name = %s, last_name = %s where email = %s"
    cur.execute(query, (first_name, last_name, email))
    con.commit()

    return True
    
def changeemail(token, email):
    prev_email = token_to_email(token)
    
    if isinstance(prev_email, int): 
        return False

    cur = con.cursor()
    query = "select user_id from Users where email = %s"
    cur.execute(query, (prev_email,))
    user_id = cur.fetchone()['user_id']
    email_thread = threading.Thread(name="conf_email_thread",
                                    args=(user_id, email),
                                    target=send_confirm_email)
    email_thread.start()

    return True

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
        return -1

    cur = con.cursor()
    query = "select profile_pic_path from Users where user_id=%s"
    cur.execute(query, (u_id,))
    old_path = cur.fetchone()['profile_pic_path']

    file_name = hashlib.sha1(image_file.read()).hexdigest()
    img = Image.open(image_file)
    out_path = f'../server_resources/images/profile_pictures/{file_name}.png'
    img.save(out_path)


    query = "update Users set profile_pic_path=%s where user_id=%s"
    cur.execute(query, (out_path, u_id))
    con.commit()

    # delete old image
    if old_path is not None:
        try:
            os.remove(old_path)
        except:
            pass



    return 0
