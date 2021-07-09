import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory, useParams } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';

import Col from 'react-bootstrap/Col';

import Alert from 'react-bootstrap/Alert';

import ProfileEdit from './edit.js';
import ProfileRecipes from "./recipes";
import {Spinner} from "react-bootstrap";

async function profileUser(userid) {
    let response = await fetch('http://localhost:5000/profile/view?' + new URLSearchParams({'user_id': userid}), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
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

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [buttonType, setButtonType] = useState(0);
    const [showSpinner, setShowSpinner] = useState(true)
    let { id } = useParams();
    id = id == null ? props.currId : id
    const history = useHistory();


    async function processId() {
        let id_ = id;
        if (id_ == null) {
            id_ = props.currId;
            if (id_ == null) history.push('/');
        }

        let response = await profileUser(id_)
            .catch(e => {

            });

        if (response != null) {
            setfirstName(response.FirstName);
            setlastName(response.LastName);
            setEmail(response.Email);
            setImgUrl(response.ProfilePictureURL);
            setSuccess(true);
        }
        else {
            setShowSpinner(false)
        }
        if (props.loggedIn) {
            if (id_ == props.currId) {
              setButtonType(1);
            }

            else setButtonType(2);
        }

        setFetched(true);
    }



    useEffect(() => {
        if (!fetched) processId();
    }, []);

    useEffect(() => {
        if (!props.loggedIn) setButtonType(0);
    }, [props.loggedIn]);

    if (success) {
        return (
            <>
            <Container style={{marginTop:"1em"}}>
                <Row>
                    <Col>
                    <div style={{textAlign:"center"}}>
                        <Image src={"http://127.0.0.1:5000/img/" + imgUrl} alt="Profile Picture" roundedCircle height="150em"/>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div style={{textAlign:"center"}}>
                        <h1>{firstName} {lastName}</h1>
                        {buttonType == 0 ? <></> : buttonType == 1 ? <ProfileEdit firstName={firstName} setfirstName={setfirstName} lastName={lastName} setlastName={setlastName} setButtonName={props.setButtonName} email={email} imgUrl={imgUrl} setImgUrl={setImgUrl} initOpen={props.settings}/> : <Button>Subscribe</Button>}
                    </div>
                    </Col>
                </Row>
                <Row style={{textAlign:"center"}}>
                    <Col>
                        <br/>
                        <h2> Recipes </h2>
                        <br/>
                    </Col>
                </Row>
                <Row className="mx-auto">
                    <Col>
                        <ProfileRecipes userID={id}/>
                    </Col>
                </Row>
            </Container>
            </>
        );
    } else {
        if (showSpinner === true) {
            return (
                <div style={{textAlign: "center"}}>
                    <br/>
                    <Spinner animation={"grow"}/>
                </div>
            )
        } else {
            return (
                <Modal.Dialog>
                    <Modal.Body>
                        <div style={{textAlign: "center"}}>
                            That recipe could not be found. <br/>
                            <Link to="/" component={Button}
                                  style={{marginTop: "1em"}}>
                                Return
                            </Link>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            );
        }
    }
}

export default Profile;