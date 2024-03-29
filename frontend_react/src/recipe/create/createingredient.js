/*
Component for the ingredient part of the recipe creation page
 */
import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

import ListGroup from "react-bootstrap/ListGroup";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Reorder from "../../images/reorder_black_24dp.svg";

function RecipeCreateIngredient({ ingredients, setIngredients }) {
    // The number of ingredients in the list
    const [idCount, setIdCount] = useState(0);

    /**
     * Handles the event where the user lets go of the mouse after a drag
     * @param e - the onDragEnd event
     */
    function handleOnDragEnd(e) {
        if (e.destination == null) return;
        const items = Array.from(ingredients);
        const [selected] = items.splice(e.source.index, 1);
        items.splice(e.destination.index, 0, selected);
        setIngredients(items);
    }

    /*
     * Adds another row (by appending an array element) for a new ingredient.
     */
    function addRow() {
        let items = Array.from(ingredients);
        items.push({
            id: idCount.toString(),
            quantity: null,
            unit: null,
            name: null,
        });
        setIdCount(idCount + 1);
        setIngredients(items);
    }

    /**
     * Changes an ingredient in the ingredients array
     * @param index - the index of the ingredient to change
     * @param key - the key of the ingredient to change
     * @param value - the new value of the ingredient
     */
    function updateIngredient(index, key, value) {
        let items = Array.from(ingredients);
        items[index][key] = value;
        setIngredients(items);
    }

    /**
     * Remove an ingredient from the ingredients array
     * @param index - the index of the ingredient to remove
     */
    function removeIngredient(index) {
        let items = Array.from(ingredients);
        items.splice(index, 1);
        setIngredients(items);
    }

    return (
        <>
            <Form.Label>Ingredients</Form.Label>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="ingredients">
                    {(provided) => (
                        <ListGroup
                            as="ul"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {ingredients.map(
                                ({ id, quantity, unit, name }, index) => {
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
                                                            className={
                                                                "my-auto"
                                                            }
                                                        >
                                                            <span>
                                                                {index + 1}
                                                            </span>
                                                        </Col>
                                                        <Form.Group
                                                            as={Col}
                                                            sm={2}
                                                            style={{
                                                                marginBottom:
                                                                    "0",
                                                            }}
                                                        >
                                                            <Form.Control
                                                                placeholder="Quantity (if any)"
                                                                type="number"
                                                                step="any"
                                                                onChange={(e) =>
                                                                    updateIngredient(
                                                                        index,
                                                                        "quantity",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Form.Group>
                                                        <Form.Group
                                                            as={Col}
                                                            sm={2}
                                                            style={{
                                                                marginBottom:
                                                                    "0",
                                                            }}
                                                        >
                                                            <Form.Control
                                                                placeholder="Unit (if any)"
                                                                onChange={(e) =>
                                                                    updateIngredient(
                                                                        index,
                                                                        "unit",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Form.Group>
                                                        <Form.Group
                                                            as={Col}
                                                            sm={6}
                                                            style={{
                                                                marginBottom:
                                                                    "0",
                                                            }}
                                                        >
                                                            <Form.Control
                                                                placeholder="Name"
                                                                required
                                                                onChange={(e) =>
                                                                    updateIngredient(
                                                                        index,
                                                                        "name",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Form.Group>
                                                        <Col
                                                            sm={1}
                                                            className={
                                                                "my-auto"
                                                            }
                                                        >
                                                            <button
                                                                type="button"
                                                                className="close"
                                                                onClick={() =>
                                                                    removeIngredient(
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
                                }
                            )}
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

export default RecipeCreateIngredient;
