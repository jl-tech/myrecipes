import os
import json

from constants import *

import threading

import helpers

from google.cloud import dialogflow

from tokenise import token_to_id
from search import do_search


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./static/chatbot_client/myrecipe-v9yo-da19f36bed8b.json"

project_id = "myrecipe-v9yo"
language_code = "en-US"



def talk(messages, session):
    '''
    Processes messages associated with session and sends a response to the messages.
    Will also send an email to the support staff if the messages are unclear.
    :param messages:
    :param session:
    :returns: 1. A tuple containing a response message and a URL.
              2. A response message.
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()

    response = connect_dialogflow_api(session, messages)

    react_message = response.query_result.fulfillment_text
    intent_name = str.format(response.query_result.intent.display_name)

    if intent_name == "Welcome":
        react_message = react_message + '##NAME##?'

    elif intent_name == "Search":
        j = json.loads(react_message)
        name = j["name"]
        meal_type = j["type"]
        serving_size = j["serving_size"]
        step = j["step"]
        ingredient = j["ingredient"]

        if name == "":
            name = None
        if meal_type == "":
            meal_type = None
        if serving_size == 0:
            serving_size = None
        if step == "":
            step = None
        if ingredient == "":
            ingredient = None

        result = do_search(name, meal_type, serving_size, None, ingredient, step)
        if len(result) == 0:
            return "Sorry, I couldn't find any recipes."
        else:
            message = "Here are the recipes I found:\n"
            i = 0
            links = []
            while i < len(result) and i < 3:
                links.append({'name': result[i]['name'], 'link': "http://localhost:3000/recipe/" + str(result[i]['recipe_id'])})
                i = i + 1
            return message, links
    elif intent_name == "Account_Settings":
        return react_message, [{'name': 'Account Settings', 'link': 'http://localhost:3000/settings'}],
    elif intent_name == "direct_to_search":
        return react_message, [{'name': 'Search', 'link': 'http://localhost:3000/search'}],
    elif intent_name == "Find_User":
        return react_message, [{'name': 'Find User', 'link': 'http://localhost:3000/users'}],
    elif intent_name == "Create":
        return react_message, [
            {'name': 'Create a Recipe', 'link': 'http://localhost:3000/recipe/create'}],
    elif intent_name == "Newsfeed":
        return react_message, [
            {'name': 'Newsfeed', 'link': 'http://localhost:3000/newsfeed'}],
    elif intent_name == "My_Profile":
        return react_message, [
            {'name': 'My Profile', 'link': 'http://localhost:3000/profile'}],
    elif intent_name == "Log_In":
        return react_message, [
            {'name': 'Log In', 'link': 'http://localhost:3000/login'}],
    elif intent_name == "Register":
        return react_message, [
            {'name': 'Log In', 'link': 'http://localhost:3000/login'}],
    elif intent_name == "Customer_Service_Email":
        send_support_email(messages)
        return "I've sent your message to our support team. Please expect a response within 24 hours."
    return react_message


def connect_dialogflow_api(session_id, text):
    '''
    Processes the text given by session_id and finds the intent of the text
    :param session_id:
    :param text:
    :returns: An object representing the intent of the text
    '''
    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(project_id, session_id)

    text_input = dialogflow.TextInput(text=text, language_code=language_code)

    query_input = dialogflow.QueryInput(text=text_input)

    return session_client.detect_intent(
        request={"session": session, "query_input": query_input}
    )

def send_support_email(messages):
    '''
    Sends an email to the myrecipes support email address detailing a message from a user.
    :param messages:
    :returns: None
    '''
    subject = "Customer request email"
    message_plain = f"""\
           {messages}
           """

    message_html = f"""\
               <html>
                   <body>
                       <p style="font-size:150%;text-align: center"> {messages} </p>
                   </body>
               </html>
               """

    email_thread = threading.Thread(name="email_thread",
                                    args=(subject, message_html, message_plain, "myrecipes.supp@gmail.com",
                                          None),
                                    target=helpers.send_email)
    email_thread.start()
