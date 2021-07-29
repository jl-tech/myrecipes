import React, { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import ProfileEditName from './editname.js';
import ProfileEditEmail from './editemail.js';
import ProfileEditPassword from './editpassword.js';
import ProfileEditPicture from './editpicture.js';

function ProfileEdit(props) {


    const [showEdit, setShowEdit] = useState(props.initOpen);
    const editShow = () => setShowEdit(true);
    const editClose = () => {setShowEdit(false);props.setModalToggle(false);};

    return (
        <>
            <Button onClick={editShow}>Edit Profile & Account Details</Button>
            <Modal show={showEdit || props.modalToggle} onHide={editClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit Profile & Account Details
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