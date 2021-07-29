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

    con = helpers.get_db_conn()
    cur = con.cursor()

    response = connect_dialogflow_api(session, messages)


    react_message = response.query_result.fulfillment_text

    if str.format(response.query_result.intent.display_name) == "Welcome":
        react_message = react_message + '##NAME##?'

    elif str.format(response.query_result.intent.display_name) == "Search":
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
    elif str.format(response.query_result.intent.display_name) == "Account_Settings":
        return react_message, [{'name': 'Account Settings', 'link': 'http://localhost:3000/settings'}],
    elif str.format(response.query_result.intent.display_name) == "direct_to_search":
        return react_message, [{'name': 'Search', 'link': 'http://localhost:3000/search'}],
    elif str.format(response.query_result.intent.display_name) == "Find_User":
        return react_message, [{'name': 'Find User', 'link': 'http://localhost:3000/users'}],
    elif str.format(response.query_result.intent.display_name) == "Create":
        return react_message, [
            {'name': 'Create a Recipe', 'link': 'http://localhost:3000/recipe/create'}],
    elif str.format(response.query_result.intent.display_name) == "Newsfeed":
        return react_message, [
            {'name': 'Newsfeed', 'link': 'http://localhost:3000/newsfeed'}],
    elif str.format(response.query_result.intent.display_name) == "My_Profile":
        return react_message, [
            {'name': 'My Profile', 'link': 'http://localhost:3000/profile'}],
    elif str.format(response.query_result.intent.display_name) == "Consumer_Service_Email":
        return "I have send the email to our service email!"
    return react_message


def connect_dialogflow_api(session_id, text):
    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(project_id, session_id)

    text_input = dialogflow.TextInput(text=text, language_code=language_code)

    query_input = dialogflow.QueryInput(text=text_input)

    return session_client.detect_intent(
        request={"session": session, "query_input": query_input}
    )

    if str.format(response.query_result.intent.display_name) == "Welcome":
        return str.format(response.query_result.fulfillment_text)

    return str.format(response.query_result.fulfillment_text)


def send_support_email(request):
    subject = "Request email from user xxx"
    message_plain = f"""\
           {request}
           """

    message_html = f"""\
               <html>
                   <body>
                       <p style="font-size:150%;text-align: center"> {request} </p>
                   </body>
               </html>
               """

    email_thread = threading.Thread(name="email_thread",
                                    args=(subject, message_html, message_plain, "myrecipes.supp@gmail.com",
                                          None),
                                    target=helpers.send_email)
    email_thread.start()

send_support_email("hi, can u help me with ...")
