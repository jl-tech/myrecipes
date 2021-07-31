/*
 Component providing the email part of the profile edit page
 */

import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Cookie from 'universal-cookie';

/**
 * Performs the API request for /profile/changeemail to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param email - the new email address
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function editEmail(token, email) {
    let response = await fetch('http://localhost:5000/profile/changeemail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            Email: email
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function ProfileEditEmail(props) {

    // Whether the text field is enabled (i.e. in edit mode)
    const [editMode, setEditMode] = useState(false);
    // The current text in the email field
    const [newEmail, setNewEmail] = useState('');
    // Whether to show the error box
    const [errorShow, setErrorShow] = useState(false);
    // The text to show in the error box
    const [errorText, setErrorText] = useState('');
    // Whether to show the success box
    const [successShow, setSuccessShow] = useState(false);

    const cookie = new Cookie();

    /**
     * Calls and awaits for the API request function to edit the email.
     * Sets the state of this component based on the response.
     */
    async function handleSubmit(event) {
        event.preventDefault();

        let response = await editEmail(cookie.get('token'), newEmail)
            .catch(e => {
                setErrorShow(true);
                setErrorText(e.message);
            });

        if (response != null) {
            setErrorShow(false);
            setEditMode(false);
            setSuccessShow(true);
        }
    }

    if (!editMode) {
        // Edit mode off, disable text input and save button
        return (
            <>
                <Row style={{
                    borderTopColor: "gray",
                    borderTopWidth: "1px",
                    borderTopStyle: "solid",
                    paddingTop: "1em",
                    marginTop: "1em"
                }}>
                    <Col sm={10}><h5>Email</h5></Col>
                    <Col sm={2}><Button variant="outline-secondary" size="sm"
                                        onClick={() => setEditMode(true)}>Edit</Button></Col>
                </Row>
                <Row>
                    <Col>{props.email}</Col>
                </Row>
                <Alert show={successShow} variant="success"
                       onClose={() => setSuccessShow(false)} dismissible>
                    Please verify the new email using the confirmation link
                    sent.
                </Alert>
            </>
        );
    } else {
        // Edit mode on, enable text field and submit button
        return (
            <>
                <Row style={{
                    borderTopColor: "gray",
                    borderTopWidth: "1px",
                    borderTopStyle: "solid",
                    paddingTop: "1em",
                    marginTop: "1em"
                }}>
                    <Col sm={10}><h5>Email</h5></Col>
                    <Col sm={2}><Button variant="outline-secondary" size="sm"
                                        onClick={() => setEditMode(false)}>Cancel</Button></Col>
                </Row>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">
                            New
                        </Form.Label>
                        <Col sm="8">
                            <Form.Control required
                                          onChange={e => setNewEmail(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    <Alert show={errorShow} variant="danger"
                           onClose={() => setErrorShow(false)} dismissible>
                        {errorText}
                    </Alert>
                    <div style={{textAlign: "center"}}>
                        <Button type="submit" size="sm">
                            Confirm
                        </Button>
                    </div>
                </Form>
            </>
        );
    }
}

export default ProfileEditEmail;