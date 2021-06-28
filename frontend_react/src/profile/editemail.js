import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Cookie from 'universal-cookie';


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
    

    const [editMode, setEditMode] = useState(false);

    const [newEmail, setNewEmail] = useState('');
    const [errorShow, setErrorShow] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [successShow, setSuccessShow] = useState(false);

    const cookie = new Cookie();

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
        return (
            <>
                <Row style={{borderTopColor:"gray",borderTopWidth:"1px",borderTopStyle:"solid",paddingTop:"1em", marginTop:"1em"}}>
                    <Col sm={10}><h5>Email</h5></Col>
                    <Col sm={2} ><Button variant="outline-secondary" size="sm" onClick={() => setEditMode(true)}>Edit</Button></Col>
                </Row>
                <Row>
                    <Col >{props.email}</Col>
                </Row>
                <Alert show={successShow} variant="success" onClose={() => setSuccessShow(false)} dismissible>
                    Please verify the new email using the confirmation link sent.
                </Alert>
            </>
        );
    } else {
        return (
            <>
                <Row style={{borderTopColor:"gray",borderTopWidth:"1px",borderTopStyle:"solid",paddingTop:"1em", marginTop:"1em"}}>
                    <Col sm={10}><h5>Email</h5></Col>
                    <Col sm={2} ><Button variant="outline-secondary" size="sm" onClick={() => setEditMode(false)}>Cancel</Button></Col>
                </Row>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">
                            New
                        </Form.Label>
                        <Col sm="8">
                            <Form.Control required onChange={e => setNewEmail(e.target.value)} />
                        </Col>
                    </Form.Group>
                    <Alert show={errorShow} variant="danger" onClose={() => setErrorShow(false)} dismissible>
                        {errorText}
                    </Alert>
                    <div style={{textAlign:"center"}}>
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