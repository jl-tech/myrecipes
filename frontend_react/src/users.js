import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Cookie from 'universal-cookie';

import Button from 'react-bootstrap/esm/Button';
import { Helmet } from "react-helmet-async";
import {CardDeck, Collapse} from "react-bootstrap";
import SearchIconSmall from "./search_white_18dp.svg";
import SearchIconBig from "./search_white_24dp.svg";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import ReactTimeAgo from "react-time-ago";
import {Typeahead} from "react-bootstrap-typeahead";
import Card from "react-bootstrap/Card";

async function requestUsers(input) {
    let response = await fetch('http://localhost:5000/profile/finduser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            input: input
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function Users(props) {
    const [input, setInput] = useState("")
    const [userData, setUserData] = useState([])
    const [userIndexHovered, setUserIndexHovered] = useState(-1)
    const [showSpinner, setShowSpinner] = useState(false)
    const [errorShow, setErrorShow] = useState(false)
    const [errorText, setErrorText] = useState("")
    const [searchHover, setSearchHovered] = useState(false)
    const [searched, setSearched] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        setSearched(true)
        let response = await requestUsers(input)
            .catch(e => {
                setErrorShow(true);
                setErrorText(e.message);
            });

        if (response != null) {
            setUserData(response)
        }
    }
    return (
        <>
        <Helmet>
                <title> Find Users </title>
         </Helmet>
        <Container style={{marginTop:"1em",marginBottom:"2em"}}>
            <Row>
                <Col>
                <div style={{textAlign:"center"}}>
                    <h2>Find Users</h2>
                    <br/>
                </div>
                </Col>
            </Row>
            <Row>
                <Col className={"mx-auto align-content-center"}>
                    <Form
                        className={searchHover ? "shadow-lg" : "shadow-sm"}
                        onSubmit={handleSubmit}  style={{width:"45%", marginLeft:"auto", marginRight: "auto"}}
                            onMouseEnter={() => setSearchHovered(true)}
                            onMouseLeave={()=> setSearchHovered(false)}>
                        <InputGroup>
                            <Form.Control
                                placeholder={"Search users by name"}
                                onChange={e => setInput(e.target.value)} required />
                            <InputGroup.Append>
                                <Button type="submit" size="sm" variant="primary" disabled={props.disabled}>
                                    <img src={props.nav ? SearchIconSmall : SearchIconBig} alt=""/>
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            <Row>
                {userData.length === 0 ?
                    (searched ?
                        <div style={{textAlign: "center", width: "100%"}}>
                            <br/>
                            <h4> No users found </h4>
                        </div>
                        :
                        null )
                    :
                    <CardDeck className={"align-content-center mx-auto"} style={{marginTop:"2em"}}>
                        {userData.map(({first_name, last_name, user_id, profile_pic_path}, index)=>
                            <Card key={index}
                                            onMouseEnter={()=>setUserIndexHovered(index)}
                                            onMouseLeave={()=>setUserIndexHovered(-1)}
                                            className={userIndexHovered === index ? "shadow-lg" : "shadow-sm"}
                                            role={"link"} onClick={() => history.push("/profile/" + user_id)}
                                            style={{marginBottom: "1em", cursor:"pointer", width:"15em"}}>

                                    <Image  src={profile_pic_path==null ?  "http://127.0.0.1:5000/img/default_recipe.png" : "http://127.0.0.1:5000/img/" + profile_pic_path} alt="Profile Picture" style={{marginTop:"1em", marginLeft:"auto", marginRight:"auto", objectFit:"cover", height:"8em", width:"8em"}} roundedCircle/>
                                    <Card.Body>

                                    <h5 style={{textAlign: "center"}}> {first_name} {last_name} </h5>
                                </Card.Body>

                            </Card>
                        )}
                    </CardDeck>}
            </Row>
        </Container>
        </>
    );
}

export default Users;