import os

import helpers
from constants import *

import bcrypt

import tokenise

import sys

import threading

from tokenise import token_to_id, token_to_email

DEFAULT_PIC = 'default.png'

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

    query_lock.acquire()
    cur = con.cursor()
    query = "insert into Users (email, first_name, last_name, password_hash, email_verified)" \
            "values (%s, %s, %s, %s, FALSE)"
    cur.execute(query, (email, first_name, last_name, hashed_pwd))
    con.commit()

    query = "select user_id from Users where email = %s"
    cur.execute(query, (email))
    user_id = cur.fetchone()

    query_lock.release()
    send_confirm_email(user_id['user_id'], email)

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

    # Verify unverified user
    query_lock.acquire()
    cur = con.cursor()
    query = "select * from Users where email = %s and email_verified = FALSE and user_id = %s"
    cur.execute(query, (data["email"], int(data["user_id"])))
    result = cur.fetchall()
    query_lock.release()
    if len(result) == 1:
        query = "update Users set email_verified = TRUE where user_id = %s"
        changed_rows = cur.execute(query, (int(data["user_id"])))
        con.commit()
        return 0
    elif len(result) > 1:
        return 1

    if email_already_exists(data["email"]):
        return 1

    query_lock.acquire()
    query = "update Users set email = %s, email_verified = TRUE where user_id = %s"
    changed_rows = cur.execute(query, (data["email"], int(data["user_id"])))
    con.commit()

    query_lock.release()
    return 0

def verify(token):
    user_id = token_to_id(token)
    
    print(user_id, file=sys.stderr)
    if user_id < 0:
        return None

    return user_id


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
    query_lock.acquire()
    cur = con.cursor()
    query = f"select user_id, password_hash from Users where email = %s"
    cur.execute(query, (email,))
    result = cur.fetchall()
    if len(result) == 0:
        query_lock.release()
        return False, -2
    p_hash = result[0]['password_hash']
    correct = bcrypt.checkpw(password.encode('utf-8'), p_hash.encode('utf-8'))
    if not correct:
        query_lock.release()
        return False, -1
    query = f"select email_verified from Users where user_id = %s"
    cur.execute(query, (result[0]['user_id'],))
    is_verified = cur.fetchall()[0]['email_verified']
    print(is_verified)
    if not is_verified:
        query_lock.release()
        return False, -3

    query_lock.release()
    return True, result[0]['user_id']


def email_already_exists(email):
    '''
    Checks whether a user with this email already exists in the database.
    :param email: The email address to check
    :return: True if the email already exists. False otherwise.
    '''
    query_lock.acquire()
    cur = con.cursor()
    query = f"select * from Users where email = %s"
    cur.execute(query, (email,))
    result = cur.fetchall()

    query_lock.release()
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

       If you did not sign up, you do not need to do anything.

       Regards,
       MyRecipes
       """

    message_html = f"""\
           <html>
               <body>
                   <p style="font-size:150%;text-align: center"> Hi! </p>

                   <b> <a href=http://localhost:3000/emailconfirm?code={code}>
                   <p style="font-size:150%;text-align: center"> Please click HERE to confirm your email.</p> </b> </a>
                   
                    <p style="font-size:100%;text-align: center"> If the link doesnt work, copy and paste the following into your browser: </p>
                    <p style="font-size:100%;text-align: center"> http://localhost:3000/emailconfirm?code={code}</p> </b>
            
                    <p style="font-size:150%;text-align: center"> If you did not sign up, you do not need to do anything. </p>
        
                    <p style="font-size:150%;text-align: center"> Regards, </p>
                    <p style="font-size:150%;text-align: center"> MyRecipes </p>
               </body>
           </html>
           """

    email_thread = threading.Thread(name="email_thread",
                                    args=(subject, message_html, message_plain, email,
                                          'https://i.imgur.com/j2apOOM.png'),
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

    query_lock.acquire()
    cur = con.cursor()
    query = 'select password_hash from Users where email = %s'
    cur.execute(query, (email,))

    result = cur.fetchall()
    if len(result) == 0:
        query_lock.release()
        return 1
    code = tokenise.encode_token({'password': result[0]['password_hash']})

    # Variables setup

    subject = "Your password reset link for MyRecipes"
    message_plain = f"""\
       Hi!

       Someone (hopefully you) requested to change your password for MyRecipes.

       Please click the link below to change your password.
       http://localhost:3000/resetpassword?code={code}

       If you did not request this change you do not need to do anything.

       Regards,
       MyRecipes
       """
    message_html = f"""\
           <html>
               <body>
                   <p style="font-size:150%;text-align: center"> Hi! </p>

                   <p style="font-size:150%;text-align: center">  Someone (hopefully you) requested to change your password for MyRecipes. </p>

                   <b> <a href=http://localhost:3000/resetpassword?code={code}> <p style="font-size:150%;text-align: center"> 
                   Please click HERE to change your password. </a> </p> </b>
                   
                   <p style="font-size:100%;text-align: center"> If the link doesnt work, copy and paste the following into your browser: </p>
                    <p style="font-size:100%;text-align: center"> http://localhost:3000/resetpassword?code={code}</p>

                    <p style="font-size:150%;text-align: center"> If you did not request this change you do not need to do anything. </p>

                    <p style="font-size:150%;text-align: center"> Regards, </p>
                    <p style="font-size:150%;text-align: center"> MyRecipes </p>
               </body>
           </html>
           """
    email_thread = threading.Thread(name="email_thread",
                                    args=(subject, message_html, message_plain,
                                          email, 'http://i.imgur.com/S9M7chn.png'),
                                    target=helpers.send_email)
    email_thread.start()

    query_lock.release()
    return 0

def reset_password(reset_code, password):
    '''
    Given a reset code, checks that code is valid, and then changes the
    password for the user account associated with that user code.
    :param reset_code: The reset code
    :param password: The new password
    :return: 0 on success. 1 if the token is not valid in any way.
    '''

    decoded = tokenise.decode_token(reset_code)
    if decoded is None:
        return 1
    if 'password' not in decoded:
        return 1

    password_hash = decoded['password']

    query_lock.acquire()
    cur = con.cursor()
    query = 'select email from Users where password_hash = %s'
    cur.execute(query, (password_hash,))

    result = cur.fetchall()
    if len(result) == 0:
        query_lock.release()
        return 1

    email_of_acc = result[0]['email']
    new_pwd_hash = hash_password(password)
    query = 'update Users set password_hash=%s where email=%s'
    cur.execute(query, (new_pwd_hash, email_of_acc))
    con.commit()
    send_pwd_change_email(email_of_acc)

    query_lock.release()
    return 0

def verify_reset_code(reset_code):
    '''
    Given a reset code, checks that code is valid
    :param reset_code: The reset code
    :return: 0 on success. 1 if the token is not valid in any way.
    '''
    decoded = tokenise.decode_token(reset_code)
    if decoded is None:

        return 1
    if 'password' not in decoded:
        return 1

    password_hash = decoded['password']

    query_lock.acquire()
    cur = con.cursor()
    query = 'select email from Users where password_hash = %s'
    cur.execute(query, (password_hash,))

    result = cur.fetchall()
    if len(result) == 0:
        query_lock.release()
        return 1

    query_lock.release()
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
        <p style="font-size:150%;text-align: center"> Hi,</p>

        <p style="font-size:150%;text-align: center"> This email is to inform you that your password was changed.</p>

        <p style="font-size:150%;text-align: center"> If you didn't expect this, contact customer support immediately.</p>

        <p style="font-size:150%;text-align: center"> Regards, </p>
        <p style="font-size:150%;text-align: center"> MyRecipes </p>
        """
    email_thread = threading.Thread(name="conf_email_thread",
                                    args=(subject, message_html, message_plain, email,
                                          'http://i.imgur.com/fUkY4mW.png'),
                                    target=helpers.send_email)
    email_thread.start()


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
