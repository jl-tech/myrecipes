import jwt

SECRET_PASSKEY = "9V^xohyJ9K2AFt!@T38h&ewvSw"

def encode_token(data):
    '''
    Encodes a dictionary into a jwt token.
    :param data: The dictionary to encode
    :return: The jwt token
    '''
    return jwt.encode(data, SECRET_PASSKEY, algorithm='HS256').decode('utf-8')


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
