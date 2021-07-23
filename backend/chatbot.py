import os
import json

from constants import *

import helpers

from google.cloud import dialogflow

from tokenise import token_to_id
from search import do_search


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "static\chatbot_client\comp3900-w16a-goodname-3261b83e6fa2.json"

project_id = "comp3900-w16a-goodname"
language_code = "en-US"


def talk(token, messages):
    '''
    user_id = token_to_id(token)
    if user_id < 0:
        return -1
    '''
    user_id = token

    con = helpers.get_db_conn()
    cur = con.cursor()

    query = "select * from Users where user_id=%s"
    cur.execute(query, (user_id,))
    result = cur.fetchall()
    first_name = result[0]['first_name']

    response = connect_dialogflow_api("123456789" + str(user_id), messages)

    react_message = response.query_result.fulfillment_text

    if str.format(response.query_result.intent.display_name) == "Welcome":
        react_message = react_message + ', ' + first_name + '?'

    elif str.format(response.query_result.intent.display_name) == "Search":
        print(react_message)
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
            return "I am sorry, " + first_name + ". No result find for given recipe."
        return "go to http://localhost:3000/recipe/" + str(result[0]['recipe_id'])

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



def test(session_id, texts):
    """Returns the result of detect intent with texts as inputs.

    Using the same `session_id` between requests allows continuation
    of the conversation."""


    session_client = dialogflow.SessionsClient()

    session = session_client.session_path(project_id, session_id)
    print("Session path: {}\n".format(session))

    for text in texts:
        text_input = dialogflow.TextInput(text=text, language_code=language_code)

        query_input = dialogflow.QueryInput(text=text_input)

        response = session_client.detect_intent(
            request={"session": session, "query_input": query_input}
        )

        print("=" * 20)
        print("Query text: {}".format(response.query_result.query_text))
        print(
            "Detected intent: {} (confidence: {})\n".format(
                response.query_result.intent.display_name,
                response.query_result.intent_detection_confidence,
            )
        )
        print("Fulfillment text: {}\n".format(response.query_result.fulfillment_text))

    return 0

print(talk(2, "how to cook a pizza"))