import jwt

SECRET_PASSKEY = "9V^xohyJ9K2AFt!@T38h&ewvSw"

def encode_token(data):
    return jwt.encode(data, SECRET_PASSKEY, algorithm='HS256').decode('utf-8')


def decode_token(token):
    try:
        return jwt.decode(token.encode('utf-8'),
                             SECRET_PASSKEY, algorithms=['HS256'])
    except:
        return None
