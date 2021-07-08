import React, {useEffect, useState} from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Cookie from 'universal-cookie';
import Card from "react-bootstrap/Card"

import {Link, useHistory} from "react-router-dom";
import {CardColumns, CardGroup} from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";


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

    async function processId() {
        let response = await requestRecipes(props.userID)
            .catch(e => {

            });

        if (response != null) {
            setRecipeData(response)
        }
        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    console.log(recipeData)

    function generateCard(recipe, index) {
        return(
            <Link style={{color:'black'}} to={"/recipe/" + recipe.recipe_id}>
                <Card key={index}>
                    <Card.Img className="top" style={{width:"100%", height:"9vw", objectFit:"cover"}} src={"http://127.0.0.1:5000/img/" + recipe.photo_path}/>
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
        )
    }

    return(

        <CardColumns style={{columnCount: 3}}>
            {recipeData.map(generateCard)}
        </CardColumns>
    )

}

export default ProfileRecipes;