import React, { useState } from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

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
import {Helmet} from "react-helmet";

async function createRecipe(token, name, type, time, serving, description, ingredients, steps, photos, photoNames) {
    let data = new FormData();
    data.append('name', name);
    data.append('type', type);
    data.append('time', time);
    data.append('serving_size', serving);
    data.append('description', description);
    data.append('ingredients', ingredients);
    data.append('steps', steps);
    data.append('photo_names', photoNames);
    for (let photo of photos) {
        data.append('photos[]', photo);
    }
    let response = await fetch('http://localhost:5000/recipe/create', {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: data
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function RecipeCreate(props) {
    
    const [name, setName] = useState(null);
    const [type, setType] = useState(null);
    const [time, setTime] = useState(null);
    const [serving, setServing] = useState(null);
    const [description, setDescription] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [photos, setPhotos] = useState([]);

    const [errorShow, setErrorShow] = useState(false);
    const [errorText, setErrorText] = useState('');

    const cookie = new Cookie();
    const history = useHistory();

    async function handleSubmit(event) {
        event.preventDefault();

        let ingredientsP = []
        for (let ingredient of ingredients) {
            ingredientsP.push({
                "name": ingredient["name"],
                "quantity": ingredient["quantity"],
                "unit": ingredient["unit"]
            });
        }

        let stepsP = []
        for (let step of steps) {
            stepsP.push({
                "description": step["description"]
            });
        }

        let photosP = []
        let photoNames = []
        for (let photo of photos) {
            photosP.push(photo["image"]);
            photoNames.push(photo["name"])
        }

        let response = await createRecipe(cookie.get('token'), name, type, time, serving, description === "null" || description === ""? null : description, JSON.stringify(ingredientsP), JSON.stringify(stepsP), photosP, JSON.stringify(photoNames))
            .catch(e => {
                setErrorShow(true);
                setErrorText(e.message);
            });

        if (response != null) {
            history.push('/recipe/' + response.recipeId);
        }
    }

    return (
        <>
        <Helmet>
                <title> Create Recipe - MyRecipes </title>
         </Helmet>
        <Container style={{marginTop:"1em",marginBottom:"2em"}}>
            <Row>
                <Col>
                <div style={{textAlign:"center"}}>
                    <h2>Create Recipe</h2>
                </div>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
                <RecipeCreateDesc setName={setName} setType={setType} setTime={setTime} setServing={setServing} setDescription={setDescription} />
                <RecipeCreateIngredient ingredients={ingredients} setIngredients={setIngredients} />
                <RecipeCreateStep steps={steps} setSteps={setSteps} />
                <RecipeCreatePhoto photos={photos} setPhotos={setPhotos} />
                <Alert show={errorShow} variant="danger" style={{marginTop:"1em"}} onClose={() => setErrorShow(false)} dismissible>
                    {errorText}
                </Alert>
                <Row style={{marginTop:"1em",textAlign:"center"}}>
                    <Col>
                        {/* <Button variant="secondary" style={{color:"white", marginRight:"1em"}}>
                            Cancel
                        </Button> */}
                        <Button type="submit" >
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>   
        </>
    );
}

export default RecipeCreate;