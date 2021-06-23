import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
// import Cookie from 'universal-cookie';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import logo from '../WIP_logo_2.png';

import Register from './register.js';

function Login() {

    return (<>
        <div style={{textAlign:"center"}}>
            <img src={logo} alt="Logo" style={{maxWidth:"500px"}}/>
        </div>
        <Modal.Dialog>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="email">
                        <Form.Control type="email" placeholder="Email address"/>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Control type="password" placeholder="Password"/>
                    </Form.Group>
                    <Button type="submit" block>
                        Log In
                    </Button>
                </Form>
                <div style={{textAlign:"center",paddingTop:"1em"}}>
                    <a href="">Forgotten password?</a>
                </div>
            </Modal.Body>
            <Modal.Footer style={{display:"block"}}>
                <div style={{textAlign:"center"}}>
                    <Register />
                </div>
            </Modal.Footer>
        </Modal.Dialog>
    </>);
}

export default Login;