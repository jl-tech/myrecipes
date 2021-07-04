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


function RecipeViewStep(props) {


    return (
        <>

        <Row style={{marginTop:"1em"}}>
            <Col>
                <h3> Steps </h3>
            </Col>
        </Row>
        <Row>
            <Col>
            <ListGroup as="ul">
                {props.steps.map(({id, description}) =>
                    <ListGroup.Item as="li" key={id}>
                    <Row>
                        <Col sm={1}>{id+1}.</Col>
                        <Col sm={11}>{description}</Col>
                    </Row>
                    </ListGroup.Item>
                )}
            </ListGroup>
            </Col>
        </Row>
        </>
    );
}

export default RecipeViewStep;