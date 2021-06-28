import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory, useParams } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

import Col from 'react-bootstrap/Col';

import Alert from 'react-bootstrap/Alert';

import ProfileImg from './profileimg.js';

async function profileUser(id) {
    let response = await fetch('http://localhost:5000/profile/view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: id
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function Profile(props) {
    
    const [fetched, setFetched] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('')
    
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    let { id } = useParams();
    const history = useHistory();

    async function processId() {
        if (id == null) {
            id = props.currId;
            if (id == null) history.go('/');
        }

        let response = await profileUser(id)
            .catch(e => {
                setMessage(e.message);
            });

        if (response != null) {
            setfirstName(response.FirstName);
            setlastName(response.LastName);
            setImgUrl(response.ProfilePictureURL);
            setSuccess(true);
        }

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    return (
        <>
        <Container style={{marginTop:"1em"}}>
            <Row>
                <Col>
                <div style={{textAlign:"center"}}>
                    <Image src={"http://127.0.0.1:5000/img/" + imgUrl} alt="Profile Picture" roundedCircle width="25%"/>
                </div>
                </Col>
            </Row>
            <Row>
                <Col>
                <div style={{textAlign:"center"}}>
                    <h1>{firstName} {lastName}</h1>
                </div>
                </Col>
            </Row>
        </Container>   
        </>
    );
}

export default Profile;