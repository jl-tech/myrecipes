import random
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from constants import *

import bcrypt
import pymysql
import smtplib

import tokenise


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

    # generate unique conf_code
    cur = con.cursor()
    is_unique = False
    conf_code = 0
    while not is_unique:
        conf_code = random.SystemRandom().randint(100000000, 999999999)
        query = "select * from Users where email_verification_code = %s"
        cur.execute(query, (int(conf_code)))
        if len(cur.fetchall()) == 0:
            is_unique = True


    query = "insert into Users(email, first_name, last_name, password_hash, email_verification_code)" \
            "values (%s, %s, %s, %s, %s)"
    cur.execute(query, (email, first_name, last_name, hashed_pwd, int(conf_code)))
    con.commit()
    send_confirm_email(email, conf_code)
    print(f"INFO: Created new account: {email}, f: {first_name}, l: {last_name}, p: {hashed_pwd}, c: {conf_code}")
    return 0

def verify_email(code):
    '''
    Given an email verification code, checks if the code is matched with
    an unverified account, and verifies that account if so.
    :param code: The email verification code
    :return: 0 on success. 1 if the code was not matched.
    '''

    cur = con.cursor()
    # generate unique conf_code
    query = "update Users " \
            "set email_verification_code=NULL " \
            "where email_verification_code=%s"
    changed_rows = cur.execute(query, (int(code)))
    con.commit()
    if changed_rows == 0:
        return 1
    else:
        print(f"INFO: Email verified for code {code}")
        return 0

def token_to_email(token):
    '''
    Given a jwt token, decodes that token into the email address corresponding
    to the token's account
    :param token: The token to decode
    :return: The email address of the account on success.
    -1 if the token couldn't be decoded
    -2 if the email decoded is not associated with an account
    -3 if the email decoded hasn't been verified
    '''
    result = tokenise.decode_token(token)
    if token is None:
        return -1
    if 'email' not in result:
        return -1

    cur = con.cursor()
    # check email exists with an account
    query = "select * from Users where email = %s"
    if len(cur.execute(query, (result['email'])).fetchall()) == 0:
        return -2
    query = "select * from Users where email = %s and email_verification_code is NULL"
    if len(cur.execute(query, (result['email'])).fetchall()) == 0:
        return -3
    return result['email']


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
    :return: True if the password was correct. False otherwise.
    :except: ValueError - if the email address was not found in the database
    '''
    cur = con.cursor()
    query = f"select password_hash from Users where email = %s"
    cur.execute(query, (email,))
    result = cur.fetchall()
    if len(result) == 0:
        raise ValueError
    p_hash = result[0]['password_hash']
    return bcrypt.checkpw(password.encode('utf-8'), p_hash.encode('utf-8'))

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

def send_confirm_email(email, code):
    '''
    Sends the email requesting the user to confirm their email to the
    specified email address
    :param email: The email address to send to
    :return: 0 on success. 1 on any error.
    '''

    # Variables setup
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
    query = 'update Users set password=%s where email=%s'
    cur.execute(query, (new_pwd_hash, email_of_acc))

    return 0



