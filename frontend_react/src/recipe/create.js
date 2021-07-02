import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Cookie from 'universal-cookie';
import RecipeCreateDesc from './createdesc.js';
import RecipeCreateIngredient from './createingredient.js';
import RecipeCreateStep from './createstep.js';
import RecipeCreatePhoto from './createphoto.js';
import Button from 'react-bootstrap/esm/Button';


function RecipeCreate(props) {
    

    const [editMode, setEditMode] = useState(false);

    const [newFirst, setNewFirst] = useState(props.firstName);
    const [newLast, setNewLast] = useState(props.lastName);
    const [errorShow, setErrorShow] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [successShow, setSuccessShow] = useState(false);

    const cookie = new Cookie();

    
    return (
        <>
        <Container style={{marginTop:"1em"}}>
            <Row>
                <Col>
                <div style={{textAlign:"center"}}>
                    <h2>Create Recipe</h2>
                </div>
                </Col>
            </Row>
            <RecipeCreateDesc />
            <RecipeCreateIngredient />
            <RecipeCreateStep />
            <RecipeCreatePhoto />
            <Row style={{marginTop:"2em",marginBottom:"2em",textAlign:"center"}}>
                <Col>
                    <Button variant="secondary" style={{color:"white"}}>
                        Cancel
                    </Button>
                    <Button style={{marginLeft:"1em"}}>
                        Submit
                    </Button>
                </Col>
            </Row>
        </Container>   
        </>
    );
}

export default RecipeCreate;