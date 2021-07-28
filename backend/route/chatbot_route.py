from flask import *
import chatbot
import hashlib

CHATBOT = Blueprint('CHATBOT', __name__, template_folder='templates')


@CHATBOT.route("/", methods=['POST'])
def route_chatbot():
    data = request.get_json()
    result = chatbot.talk(data['message'], hashlib.sha1((request.remote_addr + str(request.environ['REMOTE_PORT'])).encode('utf-8')))

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        if isinstance(result, tuple):
            response = jsonify({"response_message": result[0], "links": result[1]})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 200
        else:
            response = jsonify({"response_message": result})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 200
