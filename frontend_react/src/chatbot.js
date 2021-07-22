import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import ListGroup from 'react-bootstrap/ListGroup';
import Reorder from "./recipe/reorder_black_24dp.svg";


function Chat() {
    function updateStep(index, key, value) {
    }

    return (
        <Form.Row >
            <Form.Group as={Col} sm={10} style={{marginBottom:"0"}}>
                <Form.Control placeholder="Details" onChange={e => updateStep(1, "description", e.target.value)} required/>
            </Form.Group>
        </Form.Row>
    )
}

export default Chat;