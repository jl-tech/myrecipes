import React, {useEffect, useState} from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Cookie from 'universal-cookie';
import Card from "react-bootstrap/Card"

import {Link, useHistory, useLocation} from "react-router-dom";
import {CardColumns, CardDeck, CardGroup, Spinner} from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";
import RecipeList from '../recipe/list';


async function requestRecipes(token, name_keywords) {
    let response = await fetch('http://localhost:5000/search/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            name_keywords: name_keywords,
            type: null,
            serving_size: null,
            ingredients: null,
            step_keywords: null
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults(props) {
    const [recipeData, setRecipeData] = useState([])
    const [fetched, setFetched] = useState(false)
    const [success, setSuccess] = useState(false)
    const cookie = new Cookie();
    let query = useQuery();

    async function processQuery() {
        let response = await requestRecipes(cookie.get('token'), query.get('query'))
            .catch(e => {

            });

        if (response != null) {
            setRecipeData(response)
            setSuccess(true);
        }
        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processQuery();
    }, []);

    // console.log(recipeData)

    if (success) {
        return (
            <Container>
                <Row>
                
            {recipeData.length === 0 ?
                <p style={{textAlign: 'center'}}> No recipes found. </p> :
                <RecipeList recipeData={recipeData} setRecipeData={setRecipeData}/>}</Row>
            </Container>
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

export default SearchResults;