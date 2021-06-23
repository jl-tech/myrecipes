import bcrypt
import pymysql
import flask

def add_new_user(email, first_name, last_name, password):
    '''
    Adds a new user to the database.
    :param email:
    :param first_name:
    :param last_name:
    :param password:
    :return: 0 on success. 1 if the email already exists. 2 if the password
    didn't meet the password requirements. 3 for any other error.
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
    with con:
        cur = con.cursor()
        query = "insert into Users(email, first_name, last_name, password_hash)" \
                "values (%s, %s, %s, %s)"
        cur.execute(query, (email, first_name, last_name, hashed_pwd))
        con.commit()
        return 0


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