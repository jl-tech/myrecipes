import React, {useEffect, useState} from 'react';

import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';

import RecipeList from '../recipe/list';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Cookie from 'universal-cookie';
import ListGroup from "react-bootstrap/ListGroup";
import {useHistory} from "react-router-dom";
import Image from "react-bootstrap/Image";
import ReactTimeAgo from "react-time-ago";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


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

async function requestComments(token, user_id) {
    let response = await fetch('http://localhost:5000/profile/comments?' + new URLSearchParams({'user_id': user_id}), {
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
    const [comments, setComments] = useState([])
    const [commentIndexHovered, setCommentIndexHovered] = useState(-1)
    const [loadCommentsTo, setLoadCommentsTo] = useState(5)
    const [currCommentSort, setCurrCommentSort] = useState("newest")
    const history = useHistory()
    const cookie = new Cookie();


    /**
     * Calls and awaits for the API request function and sets the component state
     * based on the response.
     */
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

        response = await requestComments(cookie.get('token'), props.userID)
            .catch(e => {

            });

        if (response != null) {
            setComments(response)
        }
        setSuccess(true);
        setFetched(true);
    }

    function sortCommentsChange(e) {
        switch (e.target.value) {
            case "1":
                if (currCommentSort === "newest") {
                    setCurrCommentSort("oldest")
                    setLoadCommentsTo(5)
                    setComments(comments.reverse())
                }
                break
            case "0":
                if (currCommentSort === "oldest") {
                    setCurrCommentSort("newest")
                    setLoadCommentsTo(5)
                    setComments(comments.reverse())
                }
                break
        }
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    if (success) {
        return (
            <>
                <Tab.Container defaultActiveKey="all">
                    <Row style={{
                        borderRadius: "10px 10px 10px 10px",
                        backgroundColor: "#F7F7F7",
                        width: "100%"
                    }} className={"shadow-sm justify-content-center"}>
                        <Nav variant="pills">
                            <Nav.Link
                                eventKey="all">{Number(props.loggedInUID) === Number(props.userID) ? "Your Recipes (" + recipeData.length + ")" : "All Recipes (" + recipeData.length + ")"}</Nav.Link>
                            {props.loggedIn && Number(props.loggedInUID) !== Number(props.userID) ?
                                <Nav.Link eventKey="liked">Recipes You Liked
                                    ({likedRecipeData.length})</Nav.Link>
                                : null}
                            <Nav.Link
                                eventKey="they_liked"> {Number(props.loggedInUID) === Number(props.userID) ? "Your Likes (" + profileUserLikedRecipeData.length + ")" : "Recipes They Liked (" + profileUserLikedRecipeData.length + ")"}</Nav.Link>
                            <Nav.Link
                                eventKey="comments">{Number(props.loggedInUID) === Number(props.userID) ? "Your Comments (" + comments.length + ")" : "Comments (" + comments.length + ")"} </Nav.Link>
                        </Nav>
                    </Row>
                    <Row style={{marginTop: "1em"}}>

                        <Tab.Content style={{width: "100%"}}>
                            <Tab.Pane eventKey="all">
                                <Row>
                                    <RecipeList recipeData={recipeData}
                                                setRecipeData={setRecipeData}/>
                                </Row>
                            </Tab.Pane>
                            {props.loggedIn ?
                                <Tab.Pane eventKey="liked">
                                    <Row>
                                        <RecipeList recipeData={likedRecipeData}
                                                    setRecipeData={setLikedRecipeData}/>
                                    </Row>
                                </Tab.Pane>
                                : null}
                            <Tab.Pane eventKey={"they_liked"}>
                                <Row>
                                    <RecipeList
                                        recipeData={profileUserLikedRecipeData}
                                        setRecipeData={setProfileUserLikedRecipeData}/>
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey={"comments"}>
                                {comments.length === 0 ?
                                    <div style={{
                                        textAlign: "center",
                                        width: "100%"
                                    }}>
                                        <h4> Nothing to show</h4>
                                    </div>
                                    :
                                    <div>
                                        <Form>
                                            Sort by:
                                            <Form.Control as="select"
                                                          style={{width: "30%"}}
                                                          onChange={(e) => sortCommentsChange(e)}>
                                                <option value="0">Newest
                                                </option>
                                                <option value="1">Oldest
                                                </option>


                                            </Form.Control>
                                            <br/>
                                        </Form>
                                        <ListGroup>
                                            {comments.slice(0, loadCommentsTo).map(({
                                                                                        comment_text,
                                                                                        time_created,
                                                                                        name,
                                                                                        recipe_id,
                                                                                        first_name,
                                                                                        last_name,
                                                                                        photo_path
                                                                                    }, index) =>
                                                <ListGroup.Item key={index}
                                                                onMouseEnter={() => setCommentIndexHovered(index)}
                                                                onMouseLeave={() => setCommentIndexHovered(-1)}
                                                                className={commentIndexHovered === index ? "shadow-lg border-top" : "shadow-sm border-top"}
                                                                role={"link"}
                                                                onClick={() => history.push("/recipe/" + recipe_id)}
                                                                style={{
                                                                    marginBottom: "1em",
                                                                    cursor: "pointer"
                                                                }}>
                                                    <Row>
                                                        <Col sm={2}
                                                             className={"mx-auto align-content-center"}>

                                                            <Image
                                                                src={photo_path == null ? "http://127.0.0.1:5000/img/default_recipe.png" : "http://127.0.0.1:5000/img/" + photo_path}
                                                                alt="Profile Picture"
                                                                style={{
                                                                    objectFit: "cover",
                                                                    height: "5em",
                                                                    width: "9em"
                                                                }}/>
                                                        </Col>
                                                        <Col sm={10}>
                                                            <Row>
                                                                <b> {name} </b> &nbsp; {first_name} {last_name}
                                                            </Row>
                                                            <Row>
                                                                <small><ReactTimeAgo
                                                                    date={new Date(time_created)}
                                                                    locale="en-US"/></small>
                                                            </Row>
                                                            <Row>
                                                                <div
                                                                    style={{fontSize: "115%"}}> {comment_text} </div>
                                                            </Row>
                                                        </Col>
                                                    </Row>


                                                </ListGroup.Item>
                                            )}
                                        </ListGroup>
                                        {loadCommentsTo < comments.length ?
                                            <Button
                                                variant={"outline-secondary"}
                                                onClick={() => setLoadCommentsTo(loadCommentsTo + 5)}> Show
                                                more... </Button> :
                                            null
                                        }
                                    </div>
                                }

                            </Tab.Pane>
                        </Tab.Content>
                    </Row>
                </Tab.Container>
            </>
        );
    } else {
        return (
            <div style={{textAlign: "center"}}>
                <Spinner style={{color: 'tomato'}} animation={"grow"}/>
            </div>
        );
    }

}

export default ProfileRecipes;