import sys

import jwt

from constants import query_lock, con

SECRET_PASSKEY = "9V^xohyJ9K2AFt!@T38h&ewvSw"

def encode_token(data):
    '''
    Encodes a dictionary into a jwt token.
    :param data: The dictionary to encode
    :return: The jwt token
    '''
    return jwt.encode(data, SECRET_PASSKEY, algorithm='HS256')


def decode_token(token):
    '''
    Decodes a jwt token into a dictionary
    :param token: The token to decode
    :return: The dictionary
    '''
    try:
        return jwt.decode(token.encode('utf-8'),
                             SECRET_PASSKEY, algorithms=['HS256'])
    except:
        return None


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

    token_decoded = decode_token(token)
    if token_decoded is None:
        return -1

    if 'user_id' not in token_decoded:
        return -1
    user_id = token_decoded['user_id']

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
    result = cur.fetchone()['email']

    return result