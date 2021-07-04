import React, {useEffect, useState} from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { EditPhoto } from './viewphoto.js';

function EditDesc(props) {

    const editClose = () => props.setShowDescEdit(false);

    const [name, setName] = useState(props.recipeName);
    const [type, setType] = useState(props.mealType);
    const [time, setTime] = useState(props.time);
    const [serving, setServing] = useState(props.serving);

    const [errorShow, setErrorShow] = useState(false);
    const [errorText, setErrorText] = useState('');
    return (
        <Modal show={props.showDescEdit} onHide={editClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control onChange={e => setName(e.target.value)} required defaultValue={name}/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" onChange={e => setType(e.target.value)} required defaultValue={type}>
                                <option>Breakfast</option>
                                <option>Brunch</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Snack</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Time (minutes)</Form.Label>
                            <Form.Control onChange={e => setTime(e.target.value)} type="number" required defaultValue={time}/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Serving size</Form.Label>
                            <Form.Control onChange={e => setServing(e.target.value)} type="number" required defaultValue={serving}/>
                        </Form.Group>
                    </Form.Row>
                    <Alert show={errorShow} variant="danger" onClose={() => setErrorShow(false)} dismissible>
                        {errorText}
                    </Alert>
                    <div style={{textAlign:"center"}}>
                        <Button type="submit" size="sm">
                            Confirm
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

function RecipeViewDesc(props) {

    const [showDescEdit, setShowDescEdit] = useState(false);
    const descEditShow = () => setShowDescEdit(true);

    const [showPhotoEdit, setShowPhotoEdit] = useState(false);
    const photoEditShow = () => setShowPhotoEdit(true);

    return (
        <>
        <Row>
            <Col sm={2} />
            <Col sm={8}>
                <Row>
                    <Col>
                        <div style={{textAlign:"center"}}>
                            <h1>{props.recipeName}</h1>
                        </div>
                    </Col>
                </Row>
                <Row style={{textAlign:"center"}}>
                    <Col>
                    <table style={{marginLeft:"auto", marginRight:"auto", borderCollapse:"separate", borderSpacing:"2em 0em"}}><tbody>
                        <tr>
                            <th style={{fontSize:"200%"}}> {props.time} </th>
                            <th style={{fontSize:"200%"}}> {props.serving} </th>
                            <th style={{fontSize:"200%"}}> {props.mealType} </th>
                        </tr>
                        <tr>
                            <td> MINS </td>
                            <td> SERVES </td>
                            <td> MEAL </td>
                        </tr>
                    </tbody></table>
                    </Col>
                </Row>
            </Col>
            <Col sm={2}>
                {props.editable ? <>
                <Row>
                    <Col style={{textAlign:"right"}}>
                        <Button variant="outline-primary" onClick={photoEditShow}>Edit photos</Button>
                    </Col>
                </Row>
                <Row style={{marginTop:"1em",textAlign:"right"}}>
                    <Col>
                        <Button variant="outline-primary" onClick={descEditShow}>Edit details</Button>
                    </Col>
                </Row></> : <></> }
            </Col>
        </Row>
        <EditDesc showDescEdit={showDescEdit} setShowDescEdit={setShowDescEdit} recipeName={props.recipeName} setRecipeName={props.setRecipeName} time={props.time} setTime={props.setTime} serving={props.serving} setServing={props.setServing} mealType={props.mealType} setMealType={props.setMealType} />
        <EditPhoto showPhotoEdit={showPhotoEdit} setShowPhotoEdit={setShowPhotoEdit} photos={props.photos} setPhotos={props.setPhotos} />
        </>
    );
}

export default RecipeViewDesc;