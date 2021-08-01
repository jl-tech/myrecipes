/**
 * Component providing the chatbot user interface
 */

import ChatBox, { ChatFrame } from "react-chat-plugin";
import { useEffect, useState } from "react";
import CloseButton from "react-bootstrap/CloseButton";
import Image from "react-bootstrap/Image";

/**
 * Performs the API request for /auth/chatbot to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param message - the message to send to the chatbot
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestSend(message) {
    let response = await fetch("http://localhost:5000/chatbot/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: message,
        }),
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

// Attribution: this code is based in part on the example code for the react-chat-plugin
// heavily modified for MyRecipes
function ChatBot(props) {
    // Whether to show the popup saying 'Need help?'
    const [showTip, setShowTip] = useState(
        localStorage.getItem("show_tip") !== null
            ? localStorage.getItem("show_tip") !== "0"
            : true
    );
    const botAvatarURL = "http://127.0.0.1:5000/img/robot.png";
    const userAvatarURL = "http://127.0.0.1:5000/img/default.png";
    // Chatbot attributes for react-chat-plugin
    const [attr, setAttr] = useState({
        showChatbox: false,
        showIcon: true,
    });
    // Whether to show the typing indicator for the chatbot
    const [typing, setTyping] = useState(false);

    /*
    Handle clicking the chatbot icon by opening the chatbot interface and
    - loading in the chat history from localstorage
    - clearing the history if the chat history has expired (> 60 mins old)
     */
    function handleClickIcon() {
        if (
            localStorage.getItem("chatlog_expires") !== null &&
            localStorage.getItem("chatlog_expires") < new Date()
        ) {
            localStorage.removeItem("chatlog");
        }
        setAttr({
            ...attr,
            showChatbox: !attr.showChatbox,
            showIcon: !attr.showIcon,
            messages:
                localStorage.getItem("chatlog") !== null
                    ? JSON.parse(localStorage.getItem("chatlog"))
                    : [
                          {
                              author: {
                                  username: "Malvina, the MyRecipes Bot",
                                  id: 2,
                                  avatarUrl: botAvatarURL,
                              },
                              text: `👋 Hi! Let me know what you want to do.`,
                              type: "text",
                              timestamp: +new Date(),
                          },
                      ],
        });
    }

    /**
     * Calls and awaits for the API request function for chatbot
     * Updates the messages displayed in the UI based on the response
     * @param message the user's message
     */
    async function handleOnSendMessage(message) {
        // Add user included message
        let next_msg = {
            author: {
                username: "You",
                id: 1,
                avatarUrl: userAvatarURL,
            },
            text: message,
            type: "text",
            timestamp: +new Date(),
        };

        setAttr({
            ...attr,
            messages: attr.messages.concat(next_msg),
        });

        // set typing
        setTyping(true);

        let response = await requestSend(message).catch((e) => {
            // Show error indicator
            next_msg = {
                author: {
                    username: "You",
                    id: 1,
                    avatarUrl: userAvatarURL,
                },
                text: message,
                type: "text",
                timestamp: +new Date(),
                hasError: true,
            };
            setAttr({
                ...attr,
                messages: attr.messages.concat(),
            });
        });

        if (response != null) {
            // Show response
            let buttons = [];

            if (response.hasOwnProperty("links")) {
                response["links"].forEach((link) => {
                    buttons.push({
                        type: "URL",
                        title: link["name"],
                        payload: link["link"],
                    });
                });
            }
            next_msg = [
                {
                    author: {
                        username: "You",
                        id: 1,
                        avatarUrl: userAvatarURL,
                    },
                    text: message,
                    type: "text",
                    timestamp: +new Date(),
                },
                {
                    author: {
                        username: "Malvina, the MyRecipes Bot",
                        id: 2,
                        avatarUrl: botAvatarURL,
                    },
                    text: response["response_message"].replace(
                        "##NAME##",
                        props.firstName
                    ),
                    type: "text",
                    timestamp: +new Date(),
                    buttons: buttons,
                },
            ];
            setAttr({
                ...attr,
                messages: attr.messages.concat(next_msg),
            });
            setTyping(false);

            // Store new messages in chat history in localstorage
            localStorage.setItem(
                "chatlog",
                JSON.stringify(attr["messages"].concat(next_msg))
            );
            localStorage.setItem(
                "chatlog_expires",
                new Date().setHours(new Date().getHours() + 1)
            );
        }
    }

    /**
     * Sets the tip to be hidden and stores that setting in localstorage
     * so user doesn't have to dismiss again
     */
    function setHideTip() {
        setShowTip(false);
        localStorage.setItem("show_tip", "0");
    }

    useEffect(() => {
        window.remove_target_blank();
    });
    return (
        <ChatFrame
            chatbox={
                <ChatBox
                    onSendMessage={handleOnSendMessage}
                    userId={1}
                    messages={attr.messages}
                    width={"400px"}
                    showTypingIndicator={typing}
                    activeAuthor={{
                        username: "Malvina, the MyRecipes Bot",
                        id: 2,
                        avatarUrl: botAvatarURL,
                    }}
                />
            }
            icon={
                <Image
                    src={"http://127.0.0.1:5000/img/speech.png"}
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "2em",
                    }}
                />
            }
            clickIcon={handleClickIcon}
            showChatbox={attr.showChatbox}
            showIcon={attr.showIcon}
            iconStyle={{ background: "tomato", fill: "white" }}
        >
            <div
                className="Greeting shadow"
                style={{
                    width: "350px",
                    backgroundColor: "white",
                    paddingLeft: "1em",
                    paddingRight: "1em",
                    paddingTop: "1em",
                    paddingBottom: "1em",
                    borderRadius: "15px 15px 15px 15px",
                    display: showTip ? "" : "none",
                }}
            >
                👋 Need help? Ask Malvina, our bot!
                <CloseButton onClick={() => setHideTip()} />
            </div>
        </ChatFrame>
    );
}

export default ChatBot;
