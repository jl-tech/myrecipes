import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

async function registerUser(firstName, lastName, email, password) {
    let response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
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

function RegisterBody(props) {

    const [registered, setRegistered] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        if (password != password2) {
            setAlertShow(true);
            setAlertText('Passwords are different');
            return;
        }

        let response = await registerUser(firstName, lastName, email, password)
            .catch(e => {
                setAlertShow(true);
                setAlertText(e.message);
            });

        if (response != null) {
            setRegistered(true);
        }
    }

    if (!registered) {
        return (
        <Form onSubmit={handleSubmit}>
        <Form.Row>
            <Form.Group as={Col} controlId="firstname">
                <Form.Control placeholder="First name" required onChange={e => setfirstName(e.target.value)}/>
            </Form.Group>
            <Form.Group as={Col} controlId="lastname">
                <Form.Control placeholder="Last name" required onChange={e => setlastName(e.target.value)}/>
            </Form.Group>
        </Form.Row>
        <Form.Group controlId="email">
            <Form.Control type="email" placeholder="Email address" required onChange={e => setEmail(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="password">
            <Form.Control type="password" placeholder="Password" required onChange={e => setPassword(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="password">
            <Form.Control type="password" placeholder="Password" required onChange={e => setPassword2(e.target.value)}/>
        </Form.Group>
        <Alert show={alertShow} variant="danger" onClose={() => setAlertShow(false)} dismissible>
            {alertText}
        </Alert>
        <div style={{textAlign:"center"}}>
        <Button style={{backgroundColor:"#ff9147",borderColor:"#fff3de"}} type="submit">
            Sign Up
        </Button>
        </div>
        </Form>
        );
    } else {
        return (
            <>
            <div>
                We have sent an email with a confirmation link to your email address.
            </div>
            <div style={{textAlign:"center"}}>
            <Button style={{backgroundColor:"#ff9147",borderColor:"#fff3de"}} onClick={() => props.setModalShow(false)}>
                Close
            </Button>
            </div>
            </>
        );
    }
}

function Register() {
    const [modalShow, setModalShow] = useState(false);

    return (<>
        <Button style={{backgroundColor:"#ff9147",borderColor:"#ff9147"}} onClick={() => setModalShow(true)}>
            Create New Account
        </Button>
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <RegisterBody setModalShow={setModalShow} />
            </Modal.Body>
        </Modal>
    </>);
}

export default Register;