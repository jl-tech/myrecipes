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

function RecipeViewContri(props) {
        return (
            <>
            <Row>
                <Col>
                    <h4>CONTRIBUTOR</h4>
                </Col>
            </Row>
            <Row style={{marginTop:"1em"}}>
                <Col style={{textAlign:"center"}}>
                    <Image src={"http://127.0.0.1:5000/img/" + props.userImgURL} alt="Profile Picture" roundedCircle height="50em" style={{align:"left"}}/>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <Link to={`/profile/${props.contributorUID}`}>
                        {props.firstName} {props.lastName}
                    </Link>
                </Col>
            </Row>
            <Row style={{marginTop:"1em"}}>
                <Col>
                    Created on:
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:"right"}}>
                    {props.createdAt}
                </Col>
            </Row>
            {props.editedAt != null ?
            <><Row style={{marginTop:"1em"}}>
                <Col>
                    Last modified on:
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:"right"}}>
                    {props.editedAt}
                </Col>
            </Row></> : <></>
            }
            </>
        );
}

export default RecipeViewContri;