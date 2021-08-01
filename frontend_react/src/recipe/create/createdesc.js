/*
Component for the description part of the recipe creation page
 */
import React from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

function RecipeCreateDesc(props) {
    return (
        <>
            <Form.Row style={{ marginTop: "1em" }}>
                <Form.Group as={Col}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        onChange={(e) => props.setName(e.target.value)}
                        required
                    />
                </Form.Group>
            </Form.Row>
            <Form.Row style={{ marginTop: "1em" }}>
                <Form.Group as={Col}>
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={(e) => props.setType(e.target.value)}
                        required
                        defaultValue=""
                    >
                        <option disabled hidden value="">
                            -- Select an option --
                        </option>
                        <option>Breakfast</option>
                        <option>Brunch</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Time (minutes)</Form.Label>
                    <Form.Control
                        onChange={(e) => props.setTime(e.target.value)}
                        type="number"
                        required
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Serving size</Form.Label>
                    <Form.Control
                        onChange={(e) => props.setServing(e.target.value)}
                        type="number"
                        required
                    />
                </Form.Group>
            </Form.Row>
            <Form.Row style={{ marginTop: "1em" }}>
                <Form.Group as={Col}>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        onChange={(e) => props.setDescription(e.target.value)}
                    />
                </Form.Group>
            </Form.Row>
        </>
    );
}

export default RecipeCreateDesc;
