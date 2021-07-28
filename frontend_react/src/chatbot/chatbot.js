import ChatBox, {ChatFrame} from 'react-chat-plugin'
import Cookie from 'universal-cookie';
import {useState} from "react";
import CloseButton from "react-bootstrap/CloseButton";
import Image from "react-bootstrap/Image";
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
    const [showTip, setShowTip] = useState(true)
    const botAvatarURL = "http://127.0.0.1:5000/img/robot.png"
    const userAvatarURL = "http://127.0.0.1:5000/img/default.png"
    const [attr, setAttr] = useState({
        showChatbox: false,
        showIcon: true,
        messages: [{
                      author: {
                          username: 'MyRecipes Bot',
                          id: 2,
                          avatarUrl: botAvatarURL
                      },
                      text: `👋 Hi! Let me know what you want to do.`,
                      type: 'text',
                      timestamp: +new Date(),
                  }],
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
                  avatarUrl: userAvatarURL
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
                          avatarUrl: userAvatarURL
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
                          avatarUrl: userAvatarURL
                      },
                      text: message,
                      type: 'text',
                      timestamp: +new Date(),
                  },
                  {
                      author: {
                          username: 'MyRecipes Bot',
                          id: 2,
                          avatarUrl: botAvatarURL
                      },
                      text: response['response_message'].replace('##NAME##', props.firstName),
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
          activeAuthor={{ username: 'MyRecipes Bot', id: 2, avatarUrl: botAvatarURL }}
        />
      }
      icon={<Image src={"http://127.0.0.1:5000/img/speech.png"} style={{marginLeft:"auto", marginRight:"auto", width:"2em"}}/>}
      clickIcon={handleClickIcon}
      showChatbox={attr.showChatbox}
      showIcon={attr.showIcon}
      iconStyle={{ background: 'tomato', fill: 'white' }}
    >
      <div className="Greeting shadow" style={{
          width: '350px',
          backgroundColor:"white",
          paddingLeft:"1em",
          paddingRight:"1em",
          paddingTop:"1em",
          paddingBottom:"1em",
          borderRadius: "15px 15px 15px 15px",
          display: showTip ? "": "none",
      }}>
          👋 Need help? Ask MyRecipes Bot!<CloseButton onClick={()=>setShowTip(false)}/>
      </div>
    </ChatFrame>);
}

export default ChatBot;