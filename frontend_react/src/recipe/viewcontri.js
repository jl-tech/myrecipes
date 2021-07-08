import React, {useEffect, useState} from 'react';
import { Link, useLocation, useHistory, useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Cookie from 'universal-cookie';
import Button from 'react-bootstrap/esm/Button';
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import ReactTimeAgo from "react-time-ago";

function RecipeViewContri(props) {
        return (
            <>
            <Row style={{marginTop:"1em"}}>
                <Col style={{textAlign:"center"}}>
                    <Image src={"http://127.0.0.1:5000/img/" + props.userImgURL} alt="Profile Picture" roundedCircle height="50em" style={{align:"left"}}/>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:"center", fontSize:"140%"}}>
                    <Link to={`/profile/${props.contributorUID}`}>
                        {props.firstName} {props.lastName}
                    </Link>
                </Col>
            </Row>
            <Row style={{marginTop:"1em"}}>
                <Col style={{textAlign:"center"}}>
                    <b> Created </b>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <ReactTimeAgo date={new Date(props.createdAt)} locale="en-US"/>
                    <br/>
                    <small className={"text-muted"}>
                        {new Date(props.createdAt).toDateString() + " " + new Date(props.createdAt).toLocaleTimeString('en-US')}
                    </small>
                </Col>
            </Row>
            {props.editedAt != null ?
            <><Row style={{marginTop:"1em"}}>
                <Col style={{textAlign:"center"}}>
                    <b> Last modified: </b>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <ReactTimeAgo date={new Date(props.editedAt)} locale="en-US"/>
                    <br/>
                    <small className={"text-muted"}>
                        {new Date(props.editedAt).toDateString() + " " + new Date(props.editedAt).toLocaleTimeString('en-US')}
                    </small>
                </Col>
            </Row></> : <></>
            }
            </>
        );
}

export default RecipeViewContri;