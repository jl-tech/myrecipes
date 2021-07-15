import Container from "react-bootstrap/Container";
import {Spinner} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function SearchAdvanced(props) {
    return (
        <>
            <Form>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Name</Form.Label>
                    <Col sm="9">
                        <Form.Control />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Serving size</Form.Label>
                    <Col sm="9">
                        <Form.Control />
                    </Col>
                </Form.Group>
                {/* <Form.Group as={Row}>
                    <Form.Label column sm="3">Time to cook</Form.Label>
                    <Col sm="9">
                        <Form.Control />
                    </Col>
                </Form.Group> */}
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Meal type</Form.Label>
                    <Col sm="9">
                    <Form.Control as="select" onChange={e => props.setType(e.target.value)} defaultValue="">
                        <option disabled hidden value="">-- Select an option --</option>
                        <option>Breakfast</option>
                        <option>Brunch</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                    </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Ingredients</Form.Label>
                    <Col sm="9">
                        <Form.Control />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Step keywords</Form.Label>
                    <Col sm="9">
                        <Form.Control />
                    </Col>
                </Form.Group>
                <Row>
                    <Col style={{textAlign:"right"}}>
                        <Button type="submit">
                            Search
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default SearchAdvanced;