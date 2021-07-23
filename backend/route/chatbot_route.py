from flask import *
import chatbot

CHATBOT = Blueprint('CHATBOT', __name__, template_folder='templates')


@CHATBOT.route("/", methods=['POST'])
def route_chatbot():
    token = request.headers.get("Authorization")
    data = request.get_json()
    result = chatbot.talk(token, data['message'])

    if result == -1:
        response = jsonify({'error': 'Invalid token'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    else:
        response = jsonify({"response_message": result})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
