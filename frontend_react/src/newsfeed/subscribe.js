import React, { useEffect, useState } from 'react';
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

async function isSubscribed(token, userid) {
    let response = await fetch('http://localhost:5000/newsfeed/is_subscribed?' + new URLSearchParams({'user_id': userid}), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function SubscribeButton(props) {

    const [fetched, setFetched] = useState(false);
    const [subscribed, setSubscribed] = useState(null);
    const cookie = new Cookie()

    async function processId() {
        let response = await isSubscribed(cookie.get('token'), props.userid)
            .catch(e => {

            });

        if (response != null) {
            setSubscribed(response['is_subscribed']);
        }

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    async function handleButton(toSubscribe) {
        let response = await requestSubscribe(cookie.get('token'), props.userid, toSubscribe)
            .catch(e => {
            });

        if (response != null) {
            if (toSubscribe) setSubscribed(true);
            else setSubscribed(false);
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