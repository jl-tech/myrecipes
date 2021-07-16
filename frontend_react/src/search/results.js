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
import SearchBar from './bar.js';
import SearchAdvanced from './advanced.js';

async function requestRecipes(token, name_keywords, type, serving_size, time_to_cook, ingredients, step_keywords) {
    let response = await fetch('http://localhost:5000/search/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            name_keywords: name_keywords,
            type: type,
            serving_size: serving_size,
            time_to_cook: time_to_cook,
            ingredients: ingredients,
            step_keywords: step_keywords
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    console.log(responseJson)

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults(props) {
    const [recipeData, setRecipeData] = useState([])
    const [fetched, setFetched] = useState(false)
    const [errorShow, setErrorShow] = useState(false)
    const [success, setSuccess] = useState(false)
    const cookie = new Cookie();
    let query = useQuery();
    const [advancedMode, setAdvancedMode] = useState(initAdvanced());

    function validateType() {
        let type = query.get('type');
        let validTypes = ["Breakfast", "Brunch", "Lunch", "Dinner", "Snack"];
        return validTypes.includes(type) ? type : null;
    }

    function initAdvanced() {
        if (validateType() != null || query.get('serving') != null || query.get('ingredient') != null || query.get('step') != null) {
            return true;
        }
        return false;
    }


    async function processQuery() {
        let type = validateType();
        let response = await requestRecipes(cookie.get('token'), query.get('name'), type, query.get('serving'), query.get('time'), query.get('ingredient'), query.get('step'))
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

    if (success) {
        return (
            <Container style={{marginTop:"1em",marginBottom:"2em"}}>
                <Row>
                    <Col>
                        <div style={{textAlign:"center"}}>
                            <h2>Search Recipe</h2>
                        </div>
                    </Col>
                </Row>
                <Row style={{marginTop:"1em"}}>
                    <Col sm={3} />
                    <Col sm={6}>
                    <SearchBar loggedIn={props.loggedIn} init={query.get('name') != null ? query.get('name') : ""} disabled={advancedMode}/>
                    <div style={{textAlign:"right"}}>
                        <a href="#" onClick={()=>{setAdvancedMode(!advancedMode)}}>Advanced options</a>
                    </div>
                    </Col>
                </Row>
                {advancedMode ?
                    <Row style={{marginTop:"1em"}}>
                        <Col sm={3} />
                        <Col sm={6}>
                            <SearchAdvanced setErrorShow={setErrorShow}/>
                            <Alert show={errorShow} variant="danger" style={{marginTop:'1em'}} onClose={() => setErrorShow(false)} dismissible>
                                Please enter a valid search term in any field.
                            </Alert>
                        </Col>
                    </Row>
                : <></>}
                <Row style={{marginTop:"1em"}}>
                
                {recipeData.length === 0 ?
                <Col style={{textAlign: 'center'}}><span> No recipes found. </span></Col> :
                <RecipeList recipeData={recipeData} setRecipeData={setRecipeData}/>}
                </Row>
            </Container>
        )
    }
    else {
        return (
            <Container style={{textAlign: "center",marginTop:"1em",marginBottom:"2em"}}>
                    <Spinner animation={"grow"}/>
            </Container>
        )
    }

}

export default SearchResults;