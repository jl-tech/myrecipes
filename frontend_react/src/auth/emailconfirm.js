import React, {useEffect, useState} from 'react';
import {Link, useHistory, useLocation} from "react-router-dom";
import {Helmet} from "react-helmet-async";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from "react-bootstrap/Spinner";

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

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function EmailConfirm() {
    const [message, setMessage] = useState('');
    const [fetched, setFetched] = useState(false);
    const history = useHistory();
    let query = useQuery();

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
        return (
            <>
                <Modal.Dialog style={{textAlign: "center"}}>
                    <Helmet>
                        <title> Verifying email - MyRecipes </title>
                    </Helmet>
                    <Spinner style={{color: 'tomato'}} animation={"grow"}
                             style={{marginLeft: "auto", marginRight: "auto"}}/>
                </Modal.Dialog>
            </>
        );
    } else {
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