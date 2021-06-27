import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import logo from '../WIP_logo_2.png';

async function verifyResetCode(reset_code) {
    let response = await fetch('http://localhost:5000/auth/verifyresetcode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reset_code: reset_code
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

async function requestResetPassword(reset_code, password) {
    let response = await fetch('http://localhost:5000/auth/resetpassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reset_code: reset_code,
            password: password
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

function ResetPasswordBody(props) {
    const [alertShow, setAlertShow] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        let response = await requestResetPassword(props.code, password)
            .catch(e => {
                setAlertShow(true);
                setAlertText(e.message);
            });

        if (response != null) {
            setSuccess(true);
        }
    }

    if (success) {
        return (
            <>
            <div style={{textAlign:"center",marginTop:"1em"}}>
                <img src={logo} alt="Logo" style={{maxWidth:"500px"}}/>
            </div>
            <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>
                Reset Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{textAlign:"center"}}>
                    Successfully changed password <br />
                    <Link to="/login" component={Button} style={{marginTop:"1em"}}>
                        Return
                    </Link>
                </div>
            </Modal.Body>
            </Modal.Dialog >
            </>
        );
    } else {
        return (
            <>
            <div style={{textAlign:"center"}}>
                <img src={logo} alt="Logo" style={{maxWidth:"500px"}}/>
            </div>
            <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>
                Reset Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="password">
                    <Form.Control type="password" placeholder="Password" required onChange={e => setPassword(e.target.value)}/>
                </Form.Group>
                <Alert show={alertShow} variant="danger" onClose={() => setAlertShow(false)} dismissible>
                    {alertText}
                </Alert>
                <Button type="submit" block>
                    Submit
                </Button>
            </Form>
            </Modal.Body>
            </Modal.Dialog >
            </>
        );
    }
}

function ResetPasswordError(props) {
    return (
        <Modal.Dialog>
            <Modal.Body>
                <div style={{textAlign:"center"}}>
                    {props.message}<br />
                    <Link to="/login" component={Button} style={{marginTop:"1em"}}>
                        Return
                    </Link>
                </div>
            </Modal.Body>
        </Modal.Dialog>
    );
}

function ResetPassword() {

    const [message, setMessage] = useState('');
    const [fetched, setFetched] = useState(false);
    const [valid, setValid] = useState(false);
    const history = useHistory();

    let query = useQuery();
    let code = query.get("code");

    async function processCode() {
        if (code == null) history.go('/');

        let response = await verifyResetCode(code)
            .catch(e => {
                setMessage(e.message);
            });

        if (response != null) setValid(true);

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processCode()
    }, []);

    if (fetched) {
        if (valid) return (<ResetPasswordBody code={code} />);
        else return (<ResetPasswordError message={message} />); 
    } else {
        return (<Modal.Dialog></Modal.Dialog>);
    }

}

export default ResetPassword;