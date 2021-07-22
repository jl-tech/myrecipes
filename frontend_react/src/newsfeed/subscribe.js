import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Cookie from 'universal-cookie';

async function requestSubscribe(token, userid, toSubscribe) {
    let url = toSubscribe ? 'http://localhost:5000/newsfeed/subscribe' : 'http://localhost:5000/newsfeed/unsubscribe';
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            user_id: userid
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function SubscribeButton(props) {

    const [subscribed, setSubscribed] = useState(checkSubscribed());
    const cookie = new Cookie()

    function checkSubscribed() {
        if (props.subscribers.some((e) => e.user_id === props.currId)) return true;
        return false;
    }

    async function handleButton(toSubscribe) {
        let response = await requestSubscribe(cookie.get('token'), props.userId, toSubscribe)
            .catch(e => {
            });

        if (response != null) {
            if (toSubscribe) setSubscribed(true);
            else setSubscribed(false);
            props.setSubscribers(response);
        }
    }

    return (
        <>
        {subscribed
            ? 
            <Button variant="secondary" onClick={()=>handleButton(false)}>Unsubscribe</Button>
            :
            <Button onClick={()=>handleButton(true)}>Subscribe</Button>
        }
        </>
    );
}

export default SubscribeButton;