import React, { useState } from 'react';
import { Link, useLocation, useHistory, useParams } from "react-router-dom";

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


function RecipeView(props) {
    
    let { id } = useParams();

    return (
        <>
          {id}
        </>
    );
}

export default RecipeView;