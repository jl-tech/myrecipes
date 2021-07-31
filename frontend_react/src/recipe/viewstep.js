/*
Component for the step part of the recipe creation page
 */

import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Cookie from 'universal-cookie';
import Button from 'react-bootstrap/esm/Button';
import ListGroup from "react-bootstrap/ListGroup";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import Reorder from './reorder_black_24dp.svg';

/**
 * Performs the API request for /recipe/editsteps and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param recipe_id - the recipe_id of the recipe to edit steps for
 * @param steps - an array containing the new steps
*/
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
    // Whether edit mode is enabled
    const [editMode, setEditMode] = useState(false);

    // The list of steps
    const [steps, setSteps] = useState([]);
    // The number of steps
    const [idCount, setIdCount] = useState(0);

    // Whether to show the error box
    const [errorShow, setErrorShow] = useState(false);
    // The text to show in the error box
    const [errorText, setErrorText] = useState('');

    // Whether to show the success box
    const [successShow, setSuccessShow] = useState(false);

    const cookie = new Cookie();

    /**
      * Handles the event where the user lets go of the mouse after a drag
      * @param e - the onDragEnd event
      */
    function handleOnDragEnd(e) {
        if (e.destination == null) return;
        const items = Array.from(steps);
        const [selected] = items.splice(e.source.index, 1);
        items.splice(e.destination.index, 0, selected);
        setSteps(items);
    }

    /*
     * Adds another row (by appending an array element) for a new step.
     */
    function addRow() {
        let items = Array.from(steps);
        items.push({
            id: idCount.toString(),
            description: null
        });
        setIdCount(idCount + 1);
        setSteps(items);
    }

    /**
     * Changes an step in the steps array
     * @param index - the index of the step to change
     * @param key - the key of the step to change
     * @param value - the new value of the step
     */
    function updateStep(index, key, value) {
        let items = Array.from(steps);
        items[index][key] = value;
        setSteps(items);
    }

    /**
     * Remove an step from the steps array
     * @param index - the index of the step to remove
     */
    function removeStep(index) {
        let items = Array.from(steps);
        items.splice(index, 1);
        setSteps(items);
    }

    /**
     * Helper function to convert array format
     */
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

    /**
     * Enable edit mode
     */
    function showEditMode() {
        setSteps(makeJson());
        setIdCount(props.steps.length);
        setEditMode(true);
    }

    /**
     * Exit edit mode
     */
    function hideEditMode() {
        setErrorShow(false);
        setSuccessShow(false);
        setEditMode(false);
    }

    /**
     * Handles the pressing of the submit edit button by performing and awaiting
     * the request to edit
     * Updates state of the page accordingly or shows error as required.
     */
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
                <Row style={{marginTop: "1em"}}>
                    <Col sm={9}>
                        <h3> Steps </h3>
                    </Col>
                    <Col sm={3} style={{textAlign: "right"}}>
                        <Button variant="primary" size="sm"
                                style={{marginRight: "1em"}}
                                onClick={handleSubmit}>Confirm</Button>
                        <Button variant="outline-secondary" size="sm"
                                onClick={hideEditMode}>Cancel</Button>
                    </Col>
                    <Col sm={6}/>
                    <Col sm={6}>
                        <Alert show={errorShow} variant="danger"
                               onClose={() => setErrorShow(false)} dismissible>
                            {errorText}
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="steps">
                                {(provided) => (
                                    <ListGroup
                                        as="ul" {...provided.droppableProps}
                                        ref={provided.innerRef}>
                                        {steps.map(({
                                                        id,
                                                        description
                                                    }, index) => {
                                            return (
                                                <Draggable key={id}
                                                           draggableId={id}
                                                           index={index}>
                                                    {(provided) => (
                                                        <ListGroup.Item as="li"
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps} >
                                                            <Form.Row>
                                                                <Col sm={1}
                                                                     className={"my-auto"}>
                                                                    <span>{index + 1}</span>
                                                                </Col>
                                                                <Form.Group
                                                                    as={Col}
                                                                    sm={10}
                                                                    style={{marginBottom: "0"}}>
                                                                    <Form.Control
                                                                        placeholder="Details"
                                                                        onChange={e =>
                                                                            updateStep(index, "description", e.target.value)}
                                                                        required
                                                                        defaultValue={description}/>
                                                                </Form.Group>
                                                                <Col sm={1}
                                                                     className={"my-auto"}>
                                                                    <button
                                                                        type="button"
                                                                        className="close"
                                                                        onClick={() => removeStep(index)}>
                                                                        <span>×</span>
                                                                    </button>
                                                                    <img
                                                                        src={Reorder}
                                                                        alt=""/>
                                                                </Col>
                                                            </Form.Row>
                                                        </ListGroup.Item>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                        <ListGroup.Item as="li">
                                            <Button variant="outline-secondary"
                                                    style={{float: "right"}}
                                                    onClick={addRow}
                                                    size="sm">Add</Button>
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

                <Row style={{marginTop: "1em"}}>
                    <Col sm={11}>
                        <h3> Steps </h3>
                    </Col>
                    {props.editable ?
                        <>
                            <Col sm={1} style={{textAlign: "right"}}>
                                <Button variant="outline-secondary" size="sm"
                                        onClick={showEditMode}>Edit</Button>
                            </Col>
                            <Col sm={6}/>
                            <Col sm={6}>
                                <Alert show={successShow} variant="success"
                                       onClose={() => setSuccessShow(false)}
                                       dismissible>
                                    Successfully updated recipe steps
                                </Alert>
                            </Col></> : <></>}
                </Row>
                <Row>
                    <Col>
                        <ListGroup as="ul" className={"shadow-sm"}>
                            {props.steps.map(({id, description}, index) =>
                                <ListGroup.Item as="li" key={index}>
                                    <Row>
                                        <Col sm={1}>{index + 1}.</Col>
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