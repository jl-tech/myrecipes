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


function RecipeViewIngredient(props) {

    return (
        <>
        <Row>
            <Col>
                <h3> Ingredients </h3>
            </Col>
        </Row>
        <Row>
            <Col>
            <ListGroup as="ul">
                {props.ingredients.map(({quantity, unit, name}, index) =>
                    <ListGroup.Item as="li" key={index}>
                    <Row>
                        <Col sm={1}><Form.Check type="checkbox" /></Col>
                        <Col sm={11}>{quantity != null ? quantity : ''} {unit != null ? unit : ''} {name}</Col>
                    </Row>
                    </ListGroup.Item>
                )}
            </ListGroup>
            </Col>
        </Row>
        </>
    );
}

export default RecipeViewIngredient;