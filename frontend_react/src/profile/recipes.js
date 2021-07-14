import React, {useEffect, useState} from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Cookie from 'universal-cookie';
import Card from "react-bootstrap/Card"

import {Link, useHistory} from "react-router-dom";
import {CardColumns, CardDeck, CardGroup, Spinner} from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";

import Slider from '@material-ui/core/Slider';


async function requestRecipes(user_id) {
    let response = await fetch('http://localhost:5000/profile/recipes?' + new URLSearchParams({'user_id': user_id}), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}


function ProfileRecipes(props) {
    const [recipeData, setRecipeData] = useState([])
    const [fetched, setFetched] = useState(false)
    const [success, setSuccess] = useState(false)

    async function processId() {
        let response = await requestRecipes(props.userID)
            .catch(e => {

            });

        if (response != null) {
            setRecipeData(response)
            setSuccess(true);
        }
        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    console.log(recipeData)

    function generateCard(recipe, index) {
        return(
            <div  style={{padding:"1em"}}>
            <Link style={{color:'black'}} to={"/recipe/" + recipe.recipe_id} >
                {/* <Card key={index} style={{maxWidth: "20rem", minWidth: "20rem", marginBottom:"1.5rem"}}> */}
                <Card key={index}>
                    <Card.Img variant="Top" style={{width:"100%", height:"9vw", objectFit:"cover"}} alt="Recipe Image" src={recipe.photo_path == null ? "http://127.0.0.1:5000/img/default_recipe.png" : "http://127.0.0.1:5000/img/" + recipe.photo_path}/>
                    <Card.Body>
                        <Card.Title>{recipe.name}</Card.Title>
                        <Card.Text>
                            <b> Serving size: </b> {recipe.serving_size} <br />
                            <b> Time to cook:</b> {recipe.time_to_cook} minutes <br />
                            <b> Meal: </b> {recipe.type} <br />
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className={"text-muted"}>
                            {"Created "}
                            <ReactTimeAgo date={new Date(recipe.creation_time)} locale="en-US"/>
                        </small>
                    </Card.Footer>
                </Card>
            </Link>
                </div>
        )
    }
    if (success) {
        return (
            recipeData.length === 0 ?
                <Col><p style={{textAlign: 'center'}}> This user hasn't created any
                    recipes. </p></Col> :
                <>
                <Col sm={3}>
                <Row>
                    <h4>Filter</h4><br/>
                </Row>
                <Row style={{marginTop:'1em'}}>
                <h6>Meal type</h6>
                </Row><Row>
                <Form.Check type='checkbox' label='Breakfast' />
                </Row><Row>
                <Form.Check type='checkbox' label='Lunch' />
                </Row><Row>
                <Form.Check type='checkbox' label='Dinner' />
                </Row><Row>
                </Row>
                <Row style={{marginTop:'1em'}}>
                <h6>Time to cook</h6>
                </Row><Row style={{width: '80%'}}>
                <Col sm={6}>
                <Form.Control size="sm" type="number" placeholder="Min" />
                </Col>
                <Col sm={6}>
                <Form.Control size="sm" type="number" placeholder="Max" />
                </Col>

                </Row>
                <Row style={{width: '80%'}}>
                <Slider value={[20, 80]}/>
                </Row>
                <Row style={{marginTop:'1em'}}>
                <Button size="sm" variant="outline-secondary">Clear all</Button>
                </Row>
                </Col>
                <Col sm={9}>
                <Row>
                    <Col sm={8} />
                    <Col sm={4}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={4}>Sort by:</Form.Label>
                        <Col sm={8}>
                        <Form.Control as="select">
                        <option>Breakfast</option>
                        <option>Brunch</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                        </Form.Control>
                        </Col>
                    </Form.Group>
                    </Col>
                </Row>
                <Row sm={2} className="g-2">
                {/* <CardDeck style={{columnCount: 3}}
                          className={'justify-content-center'}> */}
                    {recipeData.map(generateCard)}
                {/* </CardDeck> */}
                </Row>
                </Col>
                </>
        )
    }
    else {
        return (
            <div style={{textAlign: "center"}}>
                    <Spinner animation={"grow"}/>
                </div>
        )
    }

}

export default ProfileRecipes;