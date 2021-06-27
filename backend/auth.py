import random
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from constants import *

import bcrypt
import pymysql
import smtplib

import tokenise

import sys

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
            "values (%s, %s, %s, %s, %s)"
    cur.execute(query, (email, first_name, last_name, hashed_pwd, False))
    con.commit()

    query = "select user_id from Users where email = %s"
    cur.execute(query, (email))
    user_id = cur.fetchone()
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

    cur = con.cursor()
    query = "update Users set email = %s, email_verified = %s where user_id = %s"
    changed_rows = cur.execute(query, (data["email"], True, data["user_id"]))
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
    Given a jwt token, decodes that token into the email address corresponding
    to the token's account
    :param token: The token to decode
    :return: The email address of the account on success.
    -1 if the token couldn't be decoded
    -2 if the email decoded is not associated with an account
    -3 if the email decoded hasn't been verified
    '''
    if token is None:
        return -1

    token_decoded = tokenise.decode_token(token)
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


def hash_password(password):
    '''
    Hashes a password so it can be stored in the database securely.
    This function will use a salt which is randomly generated.
    :param password: The password to hash
    :return: The hashed password which can be stored safely in the database
    '''
    pword_bytes = password.encode('utf-8')
    return bcrypt.hashpw(pword_bytes, bcrypt.gensalt())

def check_password(email, password):
    '''
    Checks whether the provided password is the correct password for the
    account with the specified email.
    :param email: The email address of the account
    :param password: The password to check
    :return: True if the password was correct.
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
    correct = bcrypt.checkpw(password.encode('utf-8'), p_hash.encode('utf-8')), result[0]['user_id']
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

    message = MIMEMultipart("alternative")
    message["Subject"] = "Confirm your email for MyRecipes"
    message["From"] = "myrecipes.supp@gmail.com"
    message["To"] = email

    message_plain = f"""\
       Hi!

       Thanks for signing up for MyRecipes.

       Please click the link below to confirm your email.
       http://localhost:3000/emailconfirm?code={code}
       
       If the link doesn't work, the code to confirm your email is {code}.

       If you did not sign up, you do not need to do anything. The account
       will be deleted in 24 hours

       Regards,
       MyRecipes
       """

    message_html = f"""\
           <html>
               <body>
                   <p> Hi! </p>

                   <p> Thanks for signing up for MyRecipes. </p>

                   <b> <p> Please click the link below to confirm your email.</p>
                    <p> http://localhost:3000/emailconfirm?code={code}</p> </b>
       
                    <p> If the link doesn't work, the code to reset your email is {code}. </p>

                    <p> If you did not sign up, you do not need to do anything. The account
                    will be deleted in 24 hours </p>

                    <p> Regards, </p>
                    <p> MyRecipes </p>
               </body>
           </html>
           """

    message.attach(MIMEText(message_plain, "plain"))
    message.attach(MIMEText(message_html, "html"))

    ctxt = ssl.create_default_context()
    # try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctxt) as server:
            server.login("myrecipes.supp@gmail.com", "#%ep773^KpScAduTj^SM6U*Gnw")
            server.sendmail("myrecipes.supp@gmail.com", email,
                            message.as_string())
    # except:
    #     return 1

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
    message = MIMEMultipart("alternative")
    message["Subject"] = "Your password reset link for MyRecipes"
    message["From"] = "myrecipes.supp@gmail.com"
    message["To"] = email

    message_plain = f"""\
       Hi!

       Someone (hopefully you) requested to change your password for MyRecipes.

       Please click the link below to change your password.
       http://localhost:3000/reset?code={code}

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

    message.attach(MIMEText(message_plain, "plain"))
    message.attach(MIMEText(message_html, "html"))

    ctxt = ssl.create_default_context()
    # try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctxt) as server:
        server.login("myrecipes.supp@gmail.com", "#%ep773^KpScAduTj^SM6U*Gnw")
        server.sendmail("myrecipes.supp@gmail.com", email,
                        message.as_string())
    # except:
    #     return 1

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

    send_pwd_change_email(email_of_acc)

    return 0

def send_pwd_change_email(email):
    # Send email to notify user
    # Variables setup
    message = MIMEMultipart("alternative")
    message["Subject"] = "Your password was changed for MyRecipes"
    message["From"] = "myrecipes.supp@gmail.com"
    message["To"] = email

    message_plain = f"""\
        Hi,

        This email is to inform you that your password was changed.

        If you didn't expect this, contact customer support immediately.

        Regards,
        MyRecipes
              """

    message.attach(MIMEText(message_plain, "plain"))

    ctxt = ssl.create_default_context()
    # try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctxt) as server:
        server.login("myrecipes.supp@gmail.com", "#%ep773^KpScAduTj^SM6U*Gnw")
        server.sendmail("myrecipes.supp@gmail.com", email,
                        message.as_string())


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
    query = "select password_hash from Users where email = %s"
    cur.execute(query, (email,))
    result = cur.fetchall()
    if not check_password(email, oldpassword):
        return False
    else:
        new_hash_password = hash_password(newpassword)
        query = 'update Users set password_hash=%s where email=%s'
        cur.execute(query, (new_hash_password, email))
        send_pwd_change_email(email)
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
    cur.execute(query, (prev_email))
    user_id = cur.fetchone()[0]
    send_confirm_email(user_id, email)

    return True