import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import ProfileEditName from './editname.js';
import ProfileEditEmail from './editemail.js';
import ProfileEditPassword from './editpassword.js';
import ProfileEditPicture from './editpicture.js';

async function profileUser(id) {
    let response = await fetch('http://localhost:5000/auth/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}
function ProfileEdit(props) {
    

    const [showEdit, setShowEdit] = useState(false);
    const editShow = () => setShowEdit(true);
    const editClose = () => setShowEdit(false);

    return (
        <>
        <Button onClick={editShow}>Edit Profile</Button>
        <Modal show={showEdit} onHide={editClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Profile
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <ProfileEditName firstName={props.firstName} setfirstName={props.setfirstName} lastName={props.lastName} setlastName={props.setlastName} setButtonName={props.setButtonName}/>
                    <ProfileEditEmail email={props.email} />
                    <ProfileEditPassword />
                    <ProfileEditPicture imgUrl={props.imgUrl} setImgUrl={props.setImgUrl} />
                </Container>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default ProfileEdit;