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

import RecipeViewDesc from './viewdesc.js';
import RecipeViewContri from './viewcontri.js';
import RecipeViewIngredient from './viewingredient.js';
import RecipeViewStep from './viewstep.js';
import RecipeViewPhoto from './viewphoto.js';

async function recipeView(recipe_id) {
    let response = await fetch('http://localhost:5000/recipe/view', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        recipe_id: recipe_id
    })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function RecipeView(props) {
    const [fetched, setFetched] = useState(false);
    const [success, setSuccess] = useState(false);

    const [recipeName, setRecipeName] = useState('');
    const [photos, setPhotos] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [editedAt, setEditedAt] = useState(null)
    const [steps, setSteps] = useState([])
    const [serving, setServing] = useState('')
    const [time, setTime] = useState('')
    const [mealType, setMealType] = useState('')

    const [contributorUID, setContributorUID] = useState('')
    const [userImgURL, setUserImageURL] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [ingredients, setIngredients] = useState('')

    let { id } = useParams();
    const history = useHistory();

    async function processId() {
        let id_ = id;
        if (id_ == null) {
            id_ = props.currId;
            if (id_ == null) history.push('/');
        }

        let response = await recipeView(id_)
            .catch(e => {

            });

        if (response != null) {
            setPhotos(response.photos);
            
            setRecipeName(response.name);
            setTime(response.time_to_cook)
            setMealType(response.type)
            setServing(response.serving_size)

            let stepsP = [];
            let nsteps = 0;
            for (let step of response.steps) {
                stepsP.push({
                    id: nsteps,
                    description: step
                });
                nsteps++;
            }
            setSteps(stepsP);

            let ingredientsP = [];
            let ningredients = 0;
            for (let ingredient of response.ingredients) {
                ingredientsP.push({
                    id: ningredients,
                    quantity: ingredient["quantity"],
                    unit: ingredient["unit"],
                    name: ingredient["name"]
                });
                ningredients++;
            }
            setIngredients(ingredientsP);

            setContributorUID(response.created_by_user_id);
            setUserImageURL(response.profile_pic_path);
            setFirstName(response.first_name);
            setLastName(response.last_name);

            let creation_date = new Date(response.creation_time);
            setCreatedAt(creation_date.toDateString() + " " + creation_date.toLocaleTimeString('en-US'));
            
            if (response.edit_time != null) {
                let edit_date = new Date(response.edit_time);
                setEditedAt(edit_date.toDateString() + " " + edit_date.toLocaleTimeString('en-US'));
            }

            setSuccess(true);
        }

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    if (success) {
        return (
            <>
            <Container style={{marginTop:"1em",marginBottom:"2em"}}>
                <RecipeViewPhoto photos={photos} />
                <RecipeViewDesc recipeName={recipeName} time={time} serving={serving} mealType={mealType} />
                <Row style={{marginTop:"1em"}}>
                    <Col sm={2} style={{marginBottom:"1em"}}>
                        <RecipeViewContri userImgURL={userImgURL} contributorUID={contributorUID} firstName={firstName} lastName={lastName} createdAt={createdAt} editedAt={editedAt}/>
                    </Col>
                    <Col sm={1} />
                    <Col sm={9}>
                        <RecipeViewIngredient ingredients={ingredients} />
                        <RecipeViewStep steps={steps} />
                    </Col>

                </Row>
            </Container>
            </>
        );
    } else {
        return (
            <Modal.Dialog>
            <Modal.Body>
            <div style={{textAlign:"center"}}>
                Invalid recipe ID<br />
                <Link to="/" component={Button} style={{marginTop:"1em"}}>
                    Return
                </Link>
            </div>
            </Modal.Body>
            </Modal.Dialog>
        );
    }
}

export default RecipeView;