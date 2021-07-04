import React, {useEffect, useState} from 'react';
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
import Image from "react-bootstrap/Image";
import ProfileEdit from "../profile/edit";
import Modal from "react-bootstrap/Modal";
import create from "./create";

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

async function profileUser(userid) {
    let response = await fetch('http://localhost:5000/profile/view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: userid
        })
    }).catch(e => {
        throw new Error(e);
    });
}

function RecipeView(props) {
    const [fetched, setFetched] = useState(false);
    const [success, setSuccess] = useState(false);

    const [recipeName, setRecipeName] = useState('');
    const [coverImgURL, setCoverImageURL] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [steps, setSteps] = useState([])
    const [serving, setServing] = useState('')
    const [time, setTime] = useState('')
    const [mealType, setMealType] = useState('')

    const [userImgURL, setUserImageURL] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [ingredients, setIngredients] = useState('')
    // const [lastName, setlastName] = useState('');
    // const [email, setEmail] = useState('');
    // const [imgUrl, setImgUrl] = useState('');
     const [buttonType, setButtonType] = useState(0);

    let { id } = useParams();
    const history = useHistory();

    async function processId() {
        let steps_html = ""
        let ingredients_html = ""
        let id_ = id;
        console.log(id_)
        if (id_ == null) {
            id_ = props.currId;
            if (id_ == null) history.push('/');
        }

        let response = await recipeView(id_)
            .catch(e => {

            });

        if (response != null) {
            setRecipeName(response.name);
            setCoverImageURL(response.photos[0])
            const creation_date = new Date(response.creation_time)
            setCreatedAt(creation_date.toDateString() + " " + creation_date.toLocaleTimeString('en-US'))
            setMealType(response.type)
            setServing(response.serving_size)
            setTime(response.time_to_cook)
            setSteps(response.steps)
            let ingredientsText = []
            response.ingredients.forEach(function (item, index) {
                ingredientsText[index] = `${item['name']}: ${item['quantity']} ${item['unit']}`
            });
            setIngredients(ingredientsText)

            // setlastName(response.LastName);
            // setEmail(response.Email);
            // setImgUrl(response.ProfilePictureURL);
            setSuccess(true);
        }

        response = await profileUser(response.created_by_user_id)
            .catch(e => {

            });

        if (response != null) {
            setUserImageURL(response.ProfilePictureURL)
            setFirstName(response.FirstName);
            setLastName(response.LastName);
        }
        if (props.loggedIn) {
            if (id_ == props.currId) setButtonType(1);
            else setButtonType(2);
        }

        setFetched(true);
    }

    async function profileUser(userid) {
    let response = await fetch('http://localhost:5000/profile/view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: userid
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);


    useEffect(() => {
        if (!props.loggedIn) setButtonType(0);
    }, [props.loggedIn]);

    if (success) {
        return (
            <>
            <Container style={{marginTop:"1em"}}>
                <Row>
                    <Col>
                        <div style={{textAlign:"center"}}>
                            <Image src={"http://127.0.0.1:5000/img/" + coverImgURL} alt="Cover Image" roundedCircle height="200em"/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{textAlign:"center"}}>
                            <h1>{recipeName}</h1>

                        {/*{buttonType == 0 ? <></> : buttonType == 1 ? <ProfileEdit firstName={firstName} setfirstName={setfirstName} lastName={lastName} setlastName={setlastName} setButtonName={props.setButtonName} email={email} imgUrl={imgUrl} setImgUrl={setImgUrl} /> : <Button>Subscribe</Button>}*/}
                        </div>
                    </Col>
                </Row>
                <Row style={{textAlign: "center"}}>
                    <table style={{marginLeft: "auto", marginRight:"auto", borderSpacing: "10px"}}>
                        <tr>
                            <th style={{fontSize:"200%"}}> {time} </th>
                            <th style={{fontSize:"200%"}}> {serving} </th>
                            <th style={{fontSize:"200%"}}> {mealType} </th>
                        </tr>
                        <tr>
                            <th> MINS </th>
                            <th> SERVES </th>
                            <th> MEAL </th>
                        </tr>
                    </table>
                </Row>
                <Row>
                    <Col sm={2}>
                        <p> CONTRIBUTOR </p>
                        <Image src={"http://127.0.0.1:5000/img/" + userImgURL} alt="Profile Picture" roundedCircle height="50em" style={{align:"left"}}/>
                        <h5> {firstName} {lastName} </h5>
                        <p> {createdAt}</p>
                    </Col>
                    <Col sm={1}>

                    </Col>
                    <Col sm={9}>
                        <h2> Ingredients </h2>
                        <ul>
                            {ingredients.map(
                                (ingredients) => (<li>{ingredients}</li>))}
                        </ul>

                        <h2> Steps </h2>
                        <ol>
                            {steps.map(
                                (step) => (<li>{step}</li>))}
                        </ol>
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