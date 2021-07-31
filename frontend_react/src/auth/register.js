/**
 * Component providing the 'Register' button on the login page
 */

import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

/**
 * Performs the API request for /auth/forgetpassword to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param email - the email to request forget password for
 * @returns {Promise<*>} The response from the server. null on failure.
 */
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

/*
    Component providing the register modal
 */
function RegisterBody(props) {
    // Whether the user has completed the register process
    const [registered, setRegistered] = useState(false);
    // Show or hide alert box
    const [alertShow, setAlertShow] = useState(false);
    // The text to display in the alert
    const [alertText, setAlertText] = useState('');
    // The current text in the first name field
    const [firstName, setfirstName] = useState('');
    // The current text in the last name field
    const [lastName, setlastName] = useState('');
    // The current text in the email field
    const [email, setEmail] = useState('');
    // The current text in the password field
    const [password, setPassword] = useState('');
    // The current text in the confirm password field
    const [password2, setPassword2] = useState('');

    /**
     * Calls and awaits for the API request function to register
     * Sets the alert field with any errors if they occur
     */
    async function handleSubmit(event) {
        event.preventDefault();

        if (password !== password2) {
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
        // Registration form not submitted yet, show registration form
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control placeholder="First name" required
                                      onChange={e => setfirstName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Control placeholder="Last name" required
                                      onChange={e => setlastName(e.target.value)}/>
                    </Form.Group>
                </Form.Row>
                <Form.Group>
                    <Form.Control type="email" placeholder="Email address"
                                  required
                                  onChange={e => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" placeholder="Password"
                                  required
                                  onChange={e => setPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" placeholder="Retype Password"
                                  required
                                  onChange={e => setPassword2(e.target.value)}/>
                </Form.Group>
                <Alert show={alertShow} variant="danger"
                       onClose={() => setAlertShow(false)} dismissible>
                    {alertText}
                </Alert>
                <div style={{textAlign: "center"}}>
                    <Button style={{
                        backgroundColor: "#ff9147",
                        borderColor: "#fff3de"
                    }} type="submit">
                        Sign Up
                    </Button>
                </div>
            </Form>
        );
    } else {
        // Registration form submitted, show confirmation
        return (
            <>
                <div>
                    We have sent an email with a confirmation link to your email
                    address.
                </div>
                <div style={{textAlign: "center"}}>
                    <Button style={{
                        backgroundColor: "#ff9147",
                        borderColor: "#fff3de"
                    }} onClick={() => props.setModalShow(false)}>
                        Close
                    </Button>
                </div>
            </>
        );
    }
}

/*
    Component providing the register button, which opens the RegisterBody
    modal when clicked
 */
function Register() {
    const [modalShow, setModalShow] = useState(false);

    return (<>
        <Button style={{backgroundColor: "#ff9147", borderColor: "#ff9147"}}
                onClick={() => setModalShow(true)}>
            Create New Account
        </Button>
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RegisterBody setModalShow={setModalShow}/>
            </Modal.Body>
        </Modal>
    </>);
}

export default Register;