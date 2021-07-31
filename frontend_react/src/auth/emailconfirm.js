/**
 * Component to handle email confirmation links.
 *
 */

import React, {useEffect, useState} from 'react';
import {Link, useHistory, useLocation} from "react-router-dom";
import {Helmet} from "react-helmet-async";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from "react-bootstrap/Spinner";

/**
 * Performs the API request for /auth/emailconfirm to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param code - the email confirmation code
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestEmailConfirm(code) {
    let response = await fetch('http://localhost:5000/auth/emailconfirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

/**
 * Gets the URL query parameters from the URL.
 * @returns {URLSearchParams} The URL query parameters
 */
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function EmailConfirm() {
    // The message to show the user
    const [message, setMessage] = useState('');
    // Whether the API request has finished being fetched
    const [fetched, setFetched] = useState(false);
    const history = useHistory();
    let query = useQuery();

    /**
     * Calls and awaits for the API request function and sets the component state
     * based on the response.
     */
    async function processCode() {
        let code = query.get("code");
        if (code == null) {
            history.push('/');
        }
        let response = await requestEmailConfirm(code)
            .catch(e => {
                setMessage(e.message);
            });

        if (response != null) setMessage("Successfully verified email");

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processCode();
    }, []);

    if (!fetched) {
        // Show loading symbol
        return (
            <>
                <Modal.Dialog style={{textAlign: "center"}}>
                    <Helmet>
                        <title> Verifying email - MyRecipes </title>
                    </Helmet>
                    <Spinner style={{
                        color: 'tomato', marginLeft: "auto",
                        marginRight: "auto"
                    }} animation={"grow"}/>
                </Modal.Dialog>
            </>
        );
    } else {
        // Show outcome result
        return (
            <>
                <Helmet>
                    <title> {message} - MyRecipes </title>
                </Helmet>

                <Modal.Dialog>
                    <Modal.Body>
                        <div style={{textAlign: "center"}}>
                            {message}<br/>
                            <Link to="/login" component={Button}
                                  style={{marginTop: "1em"}}>
                                Return
                            </Link>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </>
        );
    }

}

export default EmailConfirm;