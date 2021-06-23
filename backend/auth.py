import bcrypt
import pymysql

def new_user(email, first_name, last_name, password):
    pass

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
            return False
        else:
            return True