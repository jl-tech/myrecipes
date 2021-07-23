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

async function requestProfileUserLikedRecipes(token, user_id) {
    let response = await fetch('http://localhost:5000/profile/recipes/profileuserliked?' + new URLSearchParams({'user_id': user_id}), {
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
    const [likedRecipeData, setLikedRecipeData] = useState([])
    const [profileUserLikedRecipeData, setProfileUserLikedRecipeData] = useState([])
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

        response = await requestProfileUserLikedRecipes(cookie.get('token'), props.userID)
            .catch(e => {

            });

        if (response != null) {
            setProfileUserLikedRecipeData(response)
        }
        setSuccess(true);
        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    if (success) {
        return (
             <>
            <Tab.Container defaultActiveKey="all" >
                <Row style={{borderRadius: "10px 10px 10px 10px", backgroundColor: "#F7F7F7", width: "100%"}} className={"shadow-sm justify-content-center"} >
                    <Nav variant="pills" >
                            <Nav.Link eventKey="all">{Number(props.loggedInUID) === Number(props.userID) ? "Your Recipes (" + recipeData.length + ")": "All Recipes (" + recipeData.length + ")" }</Nav.Link>
                            {props.loggedIn && Number(props.loggedInUID) !== Number(props.userID) ?
                            <Nav.Link eventKey="liked">Recipes You Liked ({likedRecipeData.length})</Nav.Link>
                            :null}
                            <Nav.Link eventKey="they_liked"> {Number(props.loggedInUID) === Number(props.userID) ? "Your Likes (" + profileUserLikedRecipeData.length + ")" : "Recipes They Liked (" + profileUserLikedRecipeData.length + ")"}</Nav.Link>
                            <Nav.Link eventKey="comments">{Number(props.loggedInUID) === Number(props.userID) ? "Your Comments (--)" : "Comments (--)"} </Nav.Link>
                        </Nav>
                    </Row>
                <Row style={{marginTop:"1em"}}>

                        <Tab.Content style={{width:"100%"}}>
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
                            <Tab.Pane eventKey={"they_liked"}>
                                <Row>
                                    <RecipeList recipeData={profileUserLikedRecipeData} setRecipeData={setProfileUserLikedRecipeData}/>
                                </Row>
                            </Tab.Pane>
                        </Tab.Content>
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