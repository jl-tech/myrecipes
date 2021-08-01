/**
 * Component providing ingredients section in the recipe page.
 */

import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Cookie from "universal-cookie";
import Button from "react-bootstrap/esm/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Reorder from "../../images/reorder_black_24dp.svg";

/**
 * Performs the API request for /recipe/editingredients and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param recipe_id - the recipe_id of the recipe to edit ingredients for
 * @param ingredients - an array of dicts containing the new ingredients
 */
async function requestEditIngredients(token, recipe_id, ingredients) {
    let response = await fetch("http://localhost:5000/recipe/editingredients", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify({
            ingredients: ingredients,
            recipe_id: recipe_id,
        }),
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function RecipeViewIngredient(props) {
    // Whether edit mode is enabled
    const [editMode, setEditMode] = useState(false);

    //The current ingredients
    const [ingredients, setIngredients] = useState([]);
    // The current number of ingredients
    const [idCount, setIdCount] = useState(0);

    // Whether to show the error box
    const [errorShow, setErrorShow] = useState(false);
    // The text to show in the error box
    const [errorText, setErrorText] = useState("");
    // Whether to show the success box
    const [successShow, setSuccessShow] = useState(false);

    const cookie = new Cookie();

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

    /**
     * Helper function to convert array format
     */
    function makeJson() {
        let ingredientsP = [];
        let idCountP = 0;
        for (let ingredient of props.ingredients) {
            ingredientsP.push({
                id: idCountP.toString(),
                quantity: ingredient["quantity"],
                unit: ingredient["unit"],
                name: ingredient["name"],
            });
            idCountP++;
        }
        return ingredientsP;
    }

    /**
     * Go into edit mode
     */
    function showEditMode() {
        setIngredients(makeJson());
        setIdCount(props.ingredients.length);
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
        let ingredientsP = [];
        for (let ingredient of ingredients) {
            ingredientsP.push({
                name: ingredient["name"],
                quantity: ingredient["quantity"],
                unit: ingredient["unit"],
            });
        }

        let response = await requestEditIngredients(
            cookie.get("token"),
            props.recipeId,
            ingredientsP
        ).catch((e) => {
            setErrorShow(true);
            setSuccessShow(false);
            setErrorText(e.message);
        });

        if (response != null) {
            setErrorShow(false);
            let ingredientsP = [];
            for (let ingredient of ingredients) {
                ingredientsP.push({
                    name: ingredient["name"],
                    quantity: ingredient["quantity"],
                    unit: ingredient["unit"],
                });
            }
            props.setIngredients(ingredientsP);
            props.setEditedAt(response["edit_time"]);
            setSuccessShow(true);
            setEditMode(false);
        }
    }

    if (editMode && props.editable) {
        // Editable, show edit button
        return (
            <>
                <Row style={{ marginTop: "1em" }}>
                    <Col sm={9}>
                        <h3> Ingredients </h3>
                    </Col>
                    <Col sm={3} style={{ textAlign: "right" }}>
                        <Button
                            variant="primary"
                            size="sm"
                            style={{ marginRight: "1em" }}
                            onClick={handleSubmit}
                        >
                            Confirm
                        </Button>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={hideEditMode}
                        >
                            Cancel
                        </Button>
                    </Col>
                    <Col sm={6} />
                    <Col sm={6}>
                        <Alert
                            show={errorShow}
                            variant="danger"
                            onClose={() => setErrorShow(false)}
                            dismissible
                        >
                            {errorText}
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="ingredients">
                                {(provided) => (
                                    <ListGroup
                                        as="ul"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {ingredients.map(
                                            (
                                                { id, quantity, unit, name },
                                                index
                                            ) => {
                                                return (
                                                    <Draggable
                                                        key={id}
                                                        draggableId={id}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <ListGroup.Item
                                                                as="li"
                                                                ref={
                                                                    provided.innerRef
                                                                }
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
                                                                            {index +
                                                                                1}
                                                                        </span>
                                                                    </Col>
                                                                    <Form.Group
                                                                        as={Col}
                                                                        sm={3}
                                                                        style={{
                                                                            marginBottom:
                                                                                "0",
                                                                        }}
                                                                    >
                                                                        <Form.Control
                                                                            placeholder="Quantity (if any)"
                                                                            type="number"
                                                                            step="any"
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateIngredient(
                                                                                    index,
                                                                                    "quantity",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            defaultValue={
                                                                                quantity
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
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateIngredient(
                                                                                    index,
                                                                                    "unit",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            defaultValue={
                                                                                unit
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                    <Form.Group
                                                                        as={Col}
                                                                        sm={5}
                                                                        style={{
                                                                            marginBottom:
                                                                                "0",
                                                                        }}
                                                                    >
                                                                        <Form.Control
                                                                            placeholder="Name"
                                                                            required
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateIngredient(
                                                                                    index,
                                                                                    "name",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            defaultValue={
                                                                                name
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
                                                                            <span>
                                                                                ×
                                                                            </span>
                                                                        </button>
                                                                        <img
                                                                            src={
                                                                                Reorder
                                                                            }
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
                                                size="sm"
                                            >
                                                Add
                                            </Button>
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
        // Not editable
        return (
            <>
                <Row style={{ marginTop: "1em" }}>
                    <Col sm={11}>
                        <h3> Ingredients </h3>
                    </Col>
                    {props.editable ? (
                        <>
                            <Col sm={1} style={{ textAlign: "right" }}>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={showEditMode}
                                >
                                    Edit
                                </Button>
                            </Col>
                            <Col sm={6} />
                            <Col sm={6}>
                                <Alert
                                    show={successShow}
                                    variant="success"
                                    onClose={() => setSuccessShow(false)}
                                    dismissible
                                >
                                    Successfully updated recipe steps
                                </Alert>
                            </Col>
                        </>
                    ) : (
                        <></>
                    )}
                </Row>
                <Row>
                    <Col>
                        <ListGroup as="ul" className={"shadow-sm"}>
                            {props.ingredients.map(
                                ({ quantity, unit, name }, index) => (
                                    <ListGroup.Item as="li" key={index}>
                                        <Row>
                                            <Col sm={1}>
                                                <Form.Check type="checkbox" />
                                            </Col>
                                            <Col sm={11}>
                                                {quantity != null
                                                    ? quantity
                                                    : ""}{" "}
                                                {unit != null ? unit : ""}{" "}
                                                {name}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )
                            )}
                        </ListGroup>
                    </Col>
                </Row>
            </>
        );
    }
}

export default RecipeViewIngredient;
