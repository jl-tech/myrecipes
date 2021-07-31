/*
Component for the steps part of the recipe creation page
 */
import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

import ListGroup from "react-bootstrap/ListGroup";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Reorder from "../../images/reorder_black_24dp.svg";

function RecipeCreateStep({ steps, setSteps }) {
    // The number of steps in the list
    const [idCount, setIdCount] = useState(0);

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
            description: null,
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

    return (
        <>
            <Form.Label>Directions</Form.Label>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="steps">
                    {(provided) => (
                        <ListGroup
                            as="ul"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {steps.map(({ id, description }, index) => {
                                return (
                                    <Draggable
                                        key={id}
                                        draggableId={id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <ListGroup.Item
                                                as="li"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Form.Row>
                                                    <Col
                                                        sm={1}
                                                        className={"my-auto"}
                                                    >
                                                        <span>{index + 1}</span>
                                                    </Col>
                                                    <Form.Group
                                                        as={Col}
                                                        sm={10}
                                                        style={{
                                                            marginBottom: "0",
                                                        }}
                                                    >
                                                        <Form.Control
                                                            placeholder="Details"
                                                            onChange={(e) =>
                                                                updateStep(
                                                                    index,
                                                                    "description",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <Col
                                                        sm={1}
                                                        className={"my-auto"}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="close"
                                                            onClick={() =>
                                                                removeStep(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <span>×</span>
                                                        </button>
                                                        <img
                                                            src={Reorder}
                                                            alt=""
                                                        />
                                                    </Col>
                                                </Form.Row>
                                            </ListGroup.Item>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                            <ListGroup.Item as="li">
                                <Button
                                    variant="outline-secondary"
                                    style={{ float: "right" }}
                                    onClick={addRow}
                                >
                                    Add
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}

export default RecipeCreateStep;
