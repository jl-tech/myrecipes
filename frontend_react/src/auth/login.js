import React, { useState } from 'react';
import { useHistory, Switch, Route, Link } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import logo from '../WIP_logo_2.png';

import Cookie from 'universal-cookie';

import Register from './register.js';
import ForgetPassword from './forgetpassword.js';
import { Helmet } from "react-helmet-async";

async function loginUser(email, password) {
    let response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function LoginBody() {
    const [alertShow, setAlertShow] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const cookie = new Cookie();
    const history = useHistory();

    async function handleSubmit(event) {
        event.preventDefault();

        let response = await loginUser(email, password)
            .catch(e => {
                setAlertShow(true);
                setAlertText(e.message);
            });

        if (response != null) {
            cookie.set('token', response.token, {path: '/'});
            history.push('/');
            history.go(0);
        }
    }
    
    return (
        <>
            <Helmet>
                <title> Log In - MyRecipes </title>
            </Helmet>
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Control type="email" placeholder="Email address" required onChange={e => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Control type="password" placeholder="Password" required onChange={e => setPassword(e.target.value)}/>
                </Form.Group>
                <Alert show={alertShow} variant="danger" onClose={() => setAlertShow(false)} dismissible>
                    {alertText}
                </Alert>
                <Button type="submit" block>
                    Log In
                </Button>
            </Form>
            <div style={{textAlign:"center",marginTop:"1em"}}>
                <Link to="/login/forgetpassword" >Forgotten password?</Link>
            </div>
        </Modal.Body>
        <Modal.Footer style={{display:"block"}}>
            <div style={{textAlign:"center"}}>
                <Register />
            </div>
        </Modal.Footer>
        </>
    );
}

function Login() {

    return (<>
        <div style={{textAlign:"center",marginTop:"1em"}}>
            <img src={logo} alt="Logo" style={{maxWidth:"500px"}}/>
        </div>
        <Modal.Dialog>
        <Switch>
            <Route path="/login/forgetpassword">
                <ForgetPassword />
            </Route>
            <Route path="/login">
                <LoginBody />
            </Route>
        </Switch>
        </Modal.Dialog>
    </>);
}

export default Login;