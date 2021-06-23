import random
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import bcrypt
import pymysql
import smtplib


def add_new_user(email, first_name, last_name, password):
    '''
    Adds a new user to the database, and sends a confirmation email providing
    the email verification code.
    :param email:
    :param first_name:
    :param last_name:
    :param password:
    :return: On success, the confirmation code for email verification.
    -1 if the email already exists.
    -2 if the password didn't meet the password requirements.
    -3 for any other error.
    '''
    if email_already_exists(email):
        return 1

    # TODO password requirements?

    hashed_pwd = hash_password(password)
    con = pymysql.connect(host='localhost',
                          user='myrecipes',
                          password='g3iCv7sr!',
                          db='myrecipes',
                          cursorclass=pymysql.cursors.DictCursor)

    conf_code = random.SystemRandom().randint(10000000, 99999999)
    with con:
        cur = con.cursor()
        query = "insert into Users(email, first_name, last_name, password_hash, email_verification_code)" \
                "values (%s, %s, %s, %s, %s)"
        cur.execute(query, (email, first_name, last_name, hashed_pwd, int(conf_code)))
        con.commit()
        send_confirm_email(email, conf_code)
        print(f"INFO: Created new account: {email}, f: {first_name}, l: {last_name}, p: {hashed_pwd}, c: {conf_code}")
        return conf_code


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
    con = pymysql.connect(host='localhost',
                          user='myrecipes',
                          password='g3iCv7sr!',
                          db='myrecipes',
                          cursorclass=pymysql.cursors.DictCursor)
    with con:
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
    con = pymysql.connect(host='localhost',
                          user='myrecipes',
                          password='g3iCv7sr!',
                          db='myrecipes',
                          cursorclass=pymysql.cursors.DictCursor)
    with con:
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
       http://localhost:8080/confirm_email?code={code}
       
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
                    <p> http://localhost:8080/confirm_email?code={code}</p> </b>
       
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