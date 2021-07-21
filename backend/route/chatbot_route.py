from flask import *
import chatbot

CHATBOT = Blueprint('CHATBOT', __name__, template_folder='templates')


@CHATBOT.route("/", methods=['POST'])
def route_chatbot():
    token = request.headers.get("Authorization")
    data = request.get_json()
    result = chatbot.talk(token, data['messages'])
    return results
