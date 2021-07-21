import os
#from tokenise import token_to_id

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "static\chatbot_client\comp3900-w16a-goodname-3261b83e6fa2.json"
project_id = "comp3900-w16a-goodname"

def talk(token, messages):
    '''
    user_id = token_to_id(token)
    if user_id < 0:
        return -1
    '''
    user_id = token
    react = connect_dialogflow_api("123456789"+str(user_id), messages, "en-US")
    return react;


def connect_dialogflow_api(session_id, texts, language_code):
    """Returns the result of detect intent with texts as inputs.

    Using the same `session_id` between requests allows continuation
    of the conversation."""
    from google.cloud import dialogflow

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

talk(1, ["name?"])