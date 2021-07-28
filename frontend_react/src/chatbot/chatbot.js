import ChatBox, {ChatFrame} from 'react-chat-plugin'
import Cookie from 'universal-cookie';
import {useState} from "react";


async function requestSend(message) {
    let response = await fetch('http://localhost:5000/chatbot/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

// This code is based in part on the example code for the react-chat-plugin
function ChatBot(props) {
    const cookie = new Cookie()
    const [attr, setAttr] = useState({
        showChatbox: false,
        showIcon: true,
        messages: []
    });
    const [typing, setTyping] = useState(false)

  function handleClickIcon() {
    // toggle showChatbox and showIcon
    setAttr({
      ...attr,
      showChatbox: !attr.showChatbox,
      showIcon: !attr.showIcon,
    });
  }

  async function handleOnSendMessage (message) {
      setAttr({
          ...attr,
          messages: attr.messages.concat({
              author: {
                  username: 'You',
                  id: 1,
              },
              text: message,
              type: 'text',
              timestamp: +new Date(),
          }),
      });
      setTyping(true)
      let response = await requestSend(message)
          .catch(e => {
              setAttr({
                  ...attr,
                  messages: attr.messages.concat({
                      author: {
                          username: 'You',
                          id: 1,
                      },
                      text: message,
                      type: 'text',
                      timestamp: +new Date(),
                      hasError: true,
                  }),
              });
          });
      if (response != null) {
          let buttons = []

          if (response.hasOwnProperty('links')) {
              response['links'].forEach((link) => {
                  buttons.push({
                      type: 'URL',
                      title: link['name'],
                      payload: link['link']
                  });
              })
          }
          console.log(buttons)
          setAttr({
              ...attr,
              messages: attr.messages.concat({
                      author: {
                          username: 'You',
                          id: 1,
                      },
                      text: message,
                      type: 'text',
                      timestamp: +new Date(),
                  },
                  {
                      author: {
                          username: 'MyRecipes Bot',
                          id: 2,
                      },
                      text: response['response_message'].replace('##NAME##', props.firstName + "?"),
                      type: 'text',
                      timestamp: +new Date(),
                      buttons: buttons
                  }
              )
          })
          setTyping(false)
      }
  }



    return (
    <ChatFrame
      chatbox={
        <ChatBox
          onSendMessage={handleOnSendMessage}
          userId={1}
          messages={attr.messages}
          width={'400px'}
          showTypingIndicator={typing}
          activeAuthor={{ username: 'MyRecipes Bot', id: 2, avatarUrl: null }}
        />
      }
      icon={null}
      clickIcon={handleClickIcon}
      showChatbox={attr.showChatbox}
      showIcon={attr.showIcon}
      iconStyle={{ background: 'red', fill: 'white' }}
    >
      <div className="Greeting shadow-lg" style={{
          width: '250px',
          backgroundColor:"white",
          paddingLeft:"1em",
          paddingRight:"1em",
          paddingTop:"1em",
          paddingBottom:"1em",
          borderRadius: "15px 15px 15px 15px",
      }}>
        Need help? Just ask here!
      </div>
    </ChatFrame>)
}

export default ChatBot;