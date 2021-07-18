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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Reorder from './reorder_black_24dp.svg';

async function requestEditSteps(token, recipe_id, steps) {
    let response = await fetch('http://localhost:5000/recipe/editsteps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            steps: steps,
            recipe_id: recipe_id
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function RecipeViewStep(props) {

    const [editMode, setEditMode] = useState(false);

    const [steps, setSteps] = useState([]);
    const [idCount, setIdCount] = useState(0);

    const [errorShow, setErrorShow] = useState(false);
    const [errorText, setErrorText] = useState('');

    const [successShow, setSuccessShow] = useState(false);
    const cookie = new Cookie();

    function handleOnDragEnd(e) {
        if (e.destination == null) return;
        const items = Array.from(steps);
        const [selected] = items.splice(e.source.index, 1);
        items.splice(e.destination.index, 0, selected);
        setSteps(items);
    }

    function addRow() {
        let items = Array.from(steps);
        items.push({
            id: idCount.toString(),
            description: null
        });
        setIdCount(idCount + 1);
        setSteps(items);
    }

    function updateStep(index, key, value) {
        let items = Array.from(steps);
        items[index][key] = value;
        setSteps(items);
    }

    function removeStep(index) {
        let items = Array.from(steps);
        items.splice(index, 1);
        setSteps(items);
    }

    function makeJson() {
        let stepsP = [];
        let idCountP = 0;
        for (let step of props.steps) {
            stepsP.push({
                id: idCountP.toString(),
                description: step['description']
            });
            idCountP++;
        }
        return stepsP;
    }

    function showEditMode() {
        setSteps(makeJson());
        setIdCount(props.steps.length);
        setEditMode(true);
    }

    function hideEditMode() {
        setErrorShow(false);
        setSuccessShow(false);
        setEditMode(false);
    }

    async function handleSubmit() {
        let stepsP = []
        for (let step of steps) {
            stepsP.push({
                "description": step["description"]
            });
        }

        let response = await requestEditSteps(cookie.get('token'), props.recipeId, stepsP)
            .catch(e => {
                setErrorShow(true);
                setSuccessShow(false);
                setErrorText(e.message);
            });

        if (response != null) {
            setErrorShow(false);
            let stepsP = [];
            for (let step of steps) {
                stepsP.push({
                    description: step["description"]
                });
            }
            props.setSteps(stepsP);
            props.setEditedAt(response['edit_time']);
            setSuccessShow(true);
            setEditMode(false);
        }
    }

    if (editMode && props.editable) {
        return (
        <>
            <Row style={{marginTop:"1em"}}>
                <Col sm={9}>
                    <h3> Steps </h3>
                </Col>
                <Col sm={3} style={{textAlign:"right"}}>
                    <Button variant="primary" size="sm" style={{marginRight:"1em"}} onClick={handleSubmit}>Confirm</Button>
                    <Button variant="outline-secondary" size="sm" onClick={hideEditMode}>Cancel</Button>
                </Col>
                <Col sm={6} />
                <Col sm={6}>
                    <Alert show={errorShow} variant="danger" onClose={() => setErrorShow(false)} dismissible>
                        {errorText}
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="steps">
                        {(provided) => (
                            <ListGroup as="ul" {...provided.droppableProps} ref={provided.innerRef}>
                                {steps.map(({id, description}, index) => {
                                    return (
                                        <Draggable key={id} draggableId={id} index={index}>
                                            {(provided) => (
                                                <ListGroup.Item as="li" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                                    <Form.Row >
                                                        <Col sm={1}>
                                                            <span>{index+1}</span>
                                                        </Col>
                                                        <Form.Group as={Col} sm={10} style={{marginBottom:"0"}}>
                                                            <Form.Control placeholder="Details" onChange={e => updateStep(index, "description", e.target.value)} required defaultValue={description}/>
                                                        </Form.Group>
                                                        <Col sm={1}>
                                                            <button type="button" className="close" onClick={() => removeStep(index)}>
                                                                <span>×</span>
                                                            </button>
                                                            <img src={Reorder} />
                                                        </Col>
                                                    </Form.Row>
                                                </ListGroup.Item>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                                <ListGroup.Item as="li">
                                    <Button variant="outline-secondary" style={{float:"right"}} onClick={addRow} size="sm">Add</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        )}
                    </Droppable>
                </DragDropContext>
                </Col>
            </Row>
        </>
        );
    } else {
        return (
            <>

            <Row style={{marginTop:"1em"}}>
                <Col sm={11}>
                    <h3> Steps </h3>
                </Col>
                {props.editable ?
                <>
                <Col sm={1} style={{textAlign:"right"}}>
                    <Button variant="outline-secondary" size="sm" onClick={showEditMode}>Edit</Button>
                </Col>
                <Col sm={6} />
                <Col sm={6}>
                    <Alert show={successShow} variant="success" onClose={() => setSuccessShow(false)} dismissible>
                        Successfully updated recipe steps
                    </Alert>
                </Col></>:<></>}
            </Row>
            <Row>
                <Col>
                <ListGroup as="ul" className={"shadow-sm"}>
                    {props.steps.map(({id, description}, index) =>
                        <ListGroup.Item as="li" key={index}>
                        <Row>
                            <Col sm={1}>{index+1}.</Col>
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
}
                    
export default RecipeViewStep;