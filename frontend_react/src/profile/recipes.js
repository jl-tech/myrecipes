import React, {useEffect, useState} from 'react';

import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';

import RecipeList from '../recipe/list';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Cookie from 'universal-cookie';


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

async function requestLikedRecipes(token, user_id) {
    let response = await fetch('http://localhost:5000/profile/recipes/liked?' + new URLSearchParams({'user_id': user_id}), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
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
    const [likedRecipeData, setLikedRecipeData] = useState([])
    const [fetched, setFetched] = useState(false)
    const [success, setSuccess] = useState(false)
    const cookie = new Cookie();


    async function processId() {
        let response = await requestRecipes(props.userID)
            .catch(e => {

            });

        if (response != null) {
            setRecipeData(response)
        }
        response = await requestLikedRecipes(cookie.get('token'), props.userID)
            .catch(e => {

            });

        if (response != null) {
            setLikedRecipeData(response)
        }
        setSuccess(true);
        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    if (success) {
        return (
            recipeData.length === 0
            ? <Col>
                <p style={{textAlign: 'center'}}> This user hasn't created any recipes. </p>
            </Col>
            : <>
            <Tab.Container defaultActiveKey="all">
                <Row>
                    <Col sm={2}>
                    <Nav variant="pills" >
                        <Nav.Item>
                            <Nav.Link eventKey="all">All Recipes</Nav.Link>
                            {props.loggedIn ?
                            <Nav.Link eventKey="liked">Liked ({likedRecipeData.length})</Nav.Link>
                            :null}
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="all">
                                <Row>
                                <RecipeList recipeData={recipeData} setRecipeData={setRecipeData}/>
                                </Row>
                            </Tab.Pane>
                            {props.loggedIn ?
                            <Tab.Pane eventKey="liked">
                            <Row>
                                <RecipeList recipeData={likedRecipeData} setRecipeData={setLikedRecipeData}/> 
                            </Row>
                            </Tab.Pane>
                            :null}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            </>
        );
    } else {
        return (
            <div style={{textAlign: "center"}}>
                <Spinner style={{color:'tomato'}} animation={"grow"}/>
            </div>
        );
    }

}

export default ProfileRecipes;