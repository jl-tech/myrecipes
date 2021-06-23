import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function RegisterModal(props) {
    return (
        <Modal {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Row>
                    <Form.Group as={Col} controlId="firstname">
                        <Form.Control placeholder="First name"/>
                    </Form.Group>
                    <Form.Group as={Col} controlId="lastname">
                        <Form.Control placeholder="Last name"/>
                    </Form.Group>
                </Form.Row>
                <Form.Group controlId="email">
                    <Form.Control type="email" placeholder="Email address"/>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Control type="password" placeholder="Password"/>
                </Form.Group>
                <div style={{textAlign:"center"}}>
                <Button style={{backgroundColor:"#ff9147",borderColor:"#fff3de"}} type="submit">
                    Sign Up
                </Button>
                </div>
            </Form>
            </Modal.Body>
        </Modal>
    );
}

function Register() {
    const [modalShow, setModalShow] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    return (<>
        <Button style={{backgroundColor:"#ff9147",borderColor:"#fff3de"}} onClick={() => setModalShow(true)}>
            Create New Account
        </Button>
        <RegisterModal show={modalShow} onHide={() => setModalShow(false)} />
    </>);
}

export default Register;