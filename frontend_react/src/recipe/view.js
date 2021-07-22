import React, {useEffect, useState} from 'react';
import { Link, useHistory, useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import Modal from "react-bootstrap/Modal";

import RecipeViewDesc, { RecipeViewDescription } from './viewdesc.js';
import RecipeViewContri from './viewcontri.js';
import RecipeViewIngredient from './viewingredient.js';
import RecipeViewStep from './viewstep.js';
import RecipeViewPhoto from './viewphoto.js';
import {Spinner} from "react-bootstrap";
import RecipeViewNutri from "./viewnutrition";
import { Helmet } from "react-helmet-async";

async function recipeView(recipe_id) {
    let response = await fetch('http://localhost:5000/recipe/view?' + new URLSearchParams({'recipe_id': recipe_id}), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
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

    const [photos, setPhotos] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [editedAt, setEditedAt] = useState(null);

    const [recipeName, setRecipeName] = useState('');
    const [serving, setServing] = useState('');
    const [time, setTime] = useState('');
    const [mealType, setMealType] = useState('');
    const [description, setDescription] = useState('');

    const [contributorUID, setContributorUID] = useState('');
    const [userImgURL, setUserImageURL] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [calories, setCalories] = useState(0);
    const [steps, setSteps] = useState([]);
    const [ingredients, setIngredients] = useState('');
    const [likes, setLikes] = useState(0)

    const [editable, setEditable] = useState(false);

    const [deleted, setDeleted] = useState(false);

    const [spinnerVisible, setSpinnerVisible] = useState(true)

    let { id } = useParams();
    const history = useHistory();

    async function processId() {
        let id_ = id;
        if (id_ == null) history.push('/');

        let response = await recipeView(id_)
            .catch(e => {

            });

        if (response != null) {
            let photosP = [];
            for (let photo of response.photos) {
                let response = await fetch('http://127.0.0.1:5000/img/' + photo['url']);
                let blob = await response.blob();
                photosP.push({
                    url: URL.createObjectURL(blob),
                    image: blob,
                    name: photo['name']
                });
            }
            setPhotos(photosP);
            
            setRecipeName(response.name);
            setTime(response.time_to_cook);
            setMealType(response.type);
            setServing(response.serving_size);
            setDescription(response.description);
            setCalories(response.calories)
            setLikes(response.likes)

            let stepsP = [];
            for (let step of response.steps) {
                stepsP.push({
                    description: step["description"]
                });
            }
            setSteps(stepsP);

            let ingredientsP = [];
            for (let ingredient of response.ingredients) {
                ingredientsP.push({
                    quantity: ingredient["quantity"],
                    unit: ingredient["unit"],
                    name: ingredient["name"]
                });
            }
            setIngredients(response.ingredients);

            setContributorUID(response.created_by_user_id);
            setUserImageURL(response.profile_pic_path);
            setFirstName(response.first_name);
            setLastName(response.last_name);

            setCreatedAt(response.creation_time);
            
            if (response.edit_time != null) {
                setEditedAt(response.edit_time);
            }

            if (response.created_by_user_id === props.currId) {
                setEditable(true);
            }

            setSuccess(true);
        } else {
            setSpinnerVisible(false)
        }

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    useEffect(() => {
        if (!props.loggedIn) setEditable(false);
    }, [props.loggedIn]);

    if (success) {
        if (!deleted) {
            return (
                <>
                <Helmet>
                <title> {recipeName} by {firstName} {lastName} - MyRecipes </title>
                </Helmet>
                <Container style={{marginTop:"1em",marginBottom:"2em"}}>
                    <RecipeViewPhoto photos={photos} />
                    <RecipeViewDesc loggedIn={props.loggedIn} recipeId={id} recipeName={recipeName} likes={likes} setLikes={setLikes} calories={calories} setRecipeName={setRecipeName} time={time} setTime={setTime} serving={serving} setServing={setServing} mealType={mealType} setMealType={setMealType} photos={photos} setPhotos={setPhotos} editable={editable} setDeleted={setDeleted} setEditedAt={setEditedAt} description={description} setDescription={setDescription} />
                    <Row style={{marginTop:"1em"}}>
                        <Col sm={3} style={{marginBottom:"1em"}}>
                            <RecipeViewContri userImgURL={userImgURL} contributorUID={contributorUID} firstName={firstName} lastName={lastName} createdAt={createdAt} editedAt={editedAt}/>
                            <br/> <br/>
                            <RecipeViewNutri recipeId={id}/>
                        </Col>
                        <Col sm={9}>
                            <RecipeViewDescription description={description}/>
                            <RecipeViewIngredient recipeId={id} ingredients={ingredients} setIngredients={setIngredients} editable={editable} setEditedAt={setEditedAt}/>
                            <RecipeViewStep recipeId={id} steps={steps} setSteps={setSteps} editable={editable} setEditedAt={setEditedAt}/>
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
                        Recipe deleted successfully <br />
                        <Link to="/profile" component={Button} style={{marginTop:"1em"}}>
                            Return to profile
                        </Link>
                    </div>
                    </Modal.Body>
                </Modal.Dialog>
            );
        }
    } else {
        if (spinnerVisible === true) {
            return (
                <div style={{textAlign: "center"}}>
                    <br/>
                    <Spinner animation={"grow"}/>
                </div>
            )
        } else {
            return (
                <Modal.Dialog>
                    <Modal.Body>
                        <div style={{textAlign: "center"}}>
                            That recipe could not be found. <br/>
                            <Link to="/" style={{marginTop: "1em"}}>
                                <Button>Return</Button>
                            </Link>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            );
        }
    }
}

export default RecipeView;