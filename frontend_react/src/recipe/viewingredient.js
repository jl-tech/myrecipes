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

async function requestEditIngredients(token, recipe_id, ingredients) {
    let response = await fetch('http://localhost:5000/recipe/editingredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            ingredients: ingredients,
            recipe_id: recipe_id
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function RecipeViewIngredient(props) {

    const [editMode, setEditMode] = useState(false);

    const [ingredients, setIngredients] = useState([]);
    const [idCount, setIdCount] = useState(0);

    const [errorShow, setErrorShow] = useState(false);
    const [errorText, setErrorText] = useState('');

    const [successShow, setSuccessShow] = useState(false);
    const cookie = new Cookie();

    function handleOnDragEnd(e) {
        if (e.destination == null) return;
        const items = Array.from(ingredients);
        const [selected] = items.splice(e.source.index, 1);
        items.splice(e.destination.index, 0, selected);
        setIngredients(items);
    }

    function addRow() {
        let items = Array.from(ingredients);
        items.push({
            id: idCount.toString(),
            quantity: null,
            unit: null,
            name: null
        });
        setIdCount(idCount + 1);
        setIngredients(items);
    }

    function updateIngredient(index, key, value) {
        let items = Array.from(ingredients);
        items[index][key] = value;
        setIngredients(items);
    }

    function removeIngredient(index) {
        let items = Array.from(ingredients);
        items.splice(index, 1);
        setIngredients(items);
    }

    function makeJson() {
        let ingredientsP = [];
        let idCountP = 0;
        for (let ingredient of props.ingredients) {
            ingredientsP.push({
                id: idCountP.toString(),
                quantity: ingredient["quantity"],
                unit: ingredient["unit"],
                name: ingredient["name"]
            });
            idCountP++;
        }
        return ingredientsP;
    }

    function showEditMode() {
        setIngredients(makeJson());
        setIdCount(props.ingredients.length);
        setEditMode(true);
    }

    function hideEditMode() {
        setErrorShow(false);
        setSuccessShow(false);
        setEditMode(false);
    }

    async function handleSubmit() {
        let ingredientsP = []
        for (let ingredient of ingredients) {
            ingredientsP.push({
                "name": ingredient["name"],
                "quantity": ingredient["quantity"],
                "unit": ingredient["unit"]
            });
        }

        let response = await requestEditIngredients(cookie.get('token'), props.recipeId, ingredientsP)
            .catch(e => {
                setErrorShow(true);
                setSuccessShow(false);
                setErrorText(e.message);
            });

        if (response != null) {
            setErrorShow(false);
            let ingredientsP = []
            for (let ingredient of ingredients) {
                ingredientsP.push({
                    "name": ingredient["name"],
                    "quantity": ingredient["quantity"],
                    "unit": ingredient["unit"]
                });
            }
            props.setIngredients(ingredientsP);
            setSuccessShow(true);
            setEditMode(false);
        }
    }

    if (editMode && props.editable) {
        return (
        <>
            <Row style={{marginTop:"1em"}}>
                <Col sm={9}>
                    <h3> Ingredients </h3>
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
                    <Droppable droppableId="ingredients">
                        {(provided) => (
                            <ListGroup as="ul" {...provided.droppableProps} ref={provided.innerRef}>
                                {ingredients.map(({id, quantity, unit, name}, index) => {
                                    return (
                                        <Draggable key={id} draggableId={id} index={index}>
                                            {(provided) => (
                                                <ListGroup.Item as="li" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                                    <Form.Row >
                                                        <Col sm={1}>
                                                            <span>{index+1}</span>
                                                        </Col>
                                                        <Form.Group as={Col} sm={3} style={{marginBottom:"0"}}>
                                                            <Form.Control placeholder="Quantity (if any)" type="number" step="any" onChange={e => updateIngredient(index, "quantity", e.target.value)} defaultValue={quantity} />
                                                        </Form.Group>
                                                        <Form.Group as={Col} sm={2} style={{marginBottom:"0"}}>
                                                            <Form.Control placeholder="Unit (if any)" onChange={e => updateIngredient(index, "unit", e.target.value)} defaultValue={unit}/>
                                                        </Form.Group>
                                                        <Form.Group as={Col} sm={5} style={{marginBottom:"0"}}>
                                                            <Form.Control placeholder="Name" required onChange={e => updateIngredient(index, "name", e.target.value)} defaultValue={name}/>
                                                        </Form.Group>
                                                        <Col sm={1}>
                                                            <button type="button" className="close" onClick={() => removeIngredient(index)}>
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
                    <h3> Ingredients </h3>
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
}
                    
export default RecipeViewIngredient;
