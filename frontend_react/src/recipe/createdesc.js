import React from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';


function RecipeCreateDesc(props) {
        
    return (
        <>
        <Form.Row style={{marginTop:"1em"}}>
            <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="" required />
            </Form.Group>
        </Form.Row>
        <Form.Row style={{marginTop:"1em"}}>
            <Form.Group as={Col}>
                <Form.Label>Type</Form.Label>
                <Form.Control placeholder="" required />
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>Time (minutes)</Form.Label>
                <Form.Control placeholder="" type="number" required />
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>Serving size</Form.Label>
                <Form.Control placeholder="" type="number" required />
            </Form.Group>
        </Form.Row>
        </>
    );
}

export default RecipeCreateDesc;