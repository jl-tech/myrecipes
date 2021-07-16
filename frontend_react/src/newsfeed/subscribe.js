import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
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
    const [errorShow, setErrorShow] = useState(true);
    const [errorText, setErrorText] = useState('he');
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
                setErrorShow(true);
                setErrorText(e.message);
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