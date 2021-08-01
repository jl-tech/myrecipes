/**
 * Component providing the subscribe button
 */

import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Cookie from "universal-cookie";

/**
 * Performs the API request for /newsfeed/subscribe OR /news/feed/unsubscribe
 * to the backend and returns result of that request.
 * @throws The error if the API request was not successful.
 * @param token - token of user requesting
 * @param userid - userid to subcribe to
 * @param toSubscribe - whether to subscribe or unsubscribe
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestSubscribe(token, userid, toSubscribe) {
    let url = toSubscribe
        ? "http://localhost:5000/newsfeed/subscribe"
        : "http://localhost:5000/newsfeed/unsubscribe";
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify({
            user_id: userid,
        }),
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

/**
 * Performs the API request for /newsfeed/is_subscribed to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param userid - the user to check if the user requesting is subscribed to
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function isSubscribed(token, userid) {
    let response = await fetch(
        "http://localhost:5000/newsfeed/is_subscribed?" +
            new URLSearchParams({ user_id: userid }),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        }
    ).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

/*
    Component providing the subscribe button
 */
function SubscribeButton(props) {
    // Whether the API request has finished being fetched
    const [fetched, setFetched] = useState(false);
    // Whether the user is currently subscribed
    const [subscribed, setSubscribed] = useState(null);
    const cookie = new Cookie();

    /**
     * Calls and awaits for the API request function and sets the component state
     * based on the response.
     */
    async function processId() {
        let response = await isSubscribed(
            cookie.get("token"),
            props.userid
        ).catch((e) => {});

        if (response != null) {
            setSubscribed(response["is_subscribed"]);
        }

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    /**
     * Handles the button being clicked by requesting subscription/unsubscription
     * @param toSubscribe - whether to subscribe or unsubscribe
     * @returns {Promise<void>}
     */
    async function handleButton(toSubscribe) {
        let response = await requestSubscribe(
            cookie.get("token"),
            props.userid,
            toSubscribe
        ).catch((e) => {});

        if (response != null) {
            if (toSubscribe) setSubscribed(true);
            else setSubscribed(false);
            props.setSubscribers(response);
        }
    }

    return (
        <>
            {subscribed ? (
                <Button variant="secondary" onClick={() => handleButton(false)}>
                    Unsubscribe
                </Button>
            ) : (
                <Button onClick={() => handleButton(true)}>Subscribe</Button>
            )}
        </>
    );
}

export default SubscribeButton;
