import React, {useState} from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import ListGroup from 'react-bootstrap/ListGroup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Reorder from './reorder_black_24dp.svg';


function RecipeCreateStep({steps, setSteps}) {

    const [idCount, setIdCount] = useState(0);

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

    return (
        <>
        <Form.Label>Directions</Form.Label>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="steps">
                {(provided) => (
                    <ListGroup as="ul" {...provided.droppableProps} ref={provided.innerRef}>
                        {steps.map(({id, description}, index) => {
                            return (
                                <Draggable key={id} draggableId={id} index={index}>
                                    {(provided) => (
                                        <ListGroup.Item as="li"  ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                            <Form.Row >
                                                <Col sm={1}>
                                                    <span>{index+1}</span>
                                                </Col>
                                                <Form.Group as={Col} sm={10} style={{marginBottom:"0"}}>
                                                    <Form.Control placeholder="Details" onChange={e => updateStep(index, "description", e.target.value)} required/>
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
                            <Button variant="outline-secondary" style={{float:"right"}} onClick={addRow}>Add</Button>
                        </ListGroup.Item>
                    </ListGroup>
                )}
            </Droppable>
        </DragDropContext>
        </>
    );
}

export default RecipeCreateStep;