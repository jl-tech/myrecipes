import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Cookie from 'universal-cookie';
import Pagination from "react-bootstrap/Pagination";
import ListGroup from "react-bootstrap/ListGroup";
import ReactTimeAgo from "react-time-ago";

import {Helmet} from "react-helmet-async";
import Subscribers from "./subscribers.js"

async function requestFeed(token, page) {
    let response = await fetch('http://localhost:5000/newsfeed/get_feed?' + new URLSearchParams({'page': page}), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

async function profileUser(token) {
    let response = await fetch('http://localhost:5000/newsfeed/get_subscriptions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function Feed(props) {
    const [fetchedFeed, setFetchedFeed] = useState(false);
    const [fetchedProfile, setFetchedProfile] = useState(false);

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [recipeCount, setRecipeCount] = useState(0);
    const [subscribers, setSubscribers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [imgUrl, setImgUrl] = useState('');

    const [recipes, setRecipes] = useState(null);
    const [pages, setPages] = useState(null);
    const [hoveredRecipeId, setHoveredRecipeId] = useState(-1)
    const [activePage, setActivePage] = useState(null);
    let { page } = useParams();
    const cookie = new Cookie()
    const history = useHistory()

    async function getFeed() {
        let page_ = /^\d+$/.test(page) ? page : 1;
        let response = await requestFeed(cookie.get('token'), page_)
            .catch(e => {

            });

        if (response != null) {
            setRecipes(response.feed);
            setPages(response.count);
            setActivePage(parseInt(page_));
        }

        setFetchedFeed(true);
    }

    async function getProfile() {
        let response = await profileUser(cookie.get('token'))
            .catch(e => {

            });

        if (response != null) {
            setfirstName(response.FirstName);
            setlastName(response.LastName);
            setImgUrl(response.ProfilePictureURL);
            setRecipeCount(response.RecipeCount);
            setSubscribers(response.Subscribers);
            setSubscriptions(response.Subscriptions);
        }
        
        setFetchedProfile(true);
    }

    useEffect(() => {
        if (!fetchedFeed) getFeed();
        if (!fetchedProfile) getProfile();
    }, []);


    function generateCard(recipe, index) {
        return(
            <div style={{padding:"1em",width:'100%'}} key={index}>
                <Card
                    onMouseEnter={() => setHoveredRecipeId(recipe.recipe_id)}
                    onMouseLeave={() => setHoveredRecipeId(-1)}
                    className={hoveredRecipeId === recipe.recipe_id ? 'shadow-lg' : 'shadow-sm'}>
                    <div style={{color:'black', textDecoration: 'none', cursor:'pointer'}} role="link" onClick={()=>history.push("/recipe/" + recipe.recipe_id)} >
                        <Card.Img variant="Top" style={{width:"100%", height:"9vw", objectFit:"cover"}} alt="Recipe Image" src={recipe.photo_path == null ? "http://127.0.0.1:5000/img/default_recipe.png" : "http://127.0.0.1:5000/img/" + recipe.photo_path}/>
                        <Card.Body style={{textAlign: "center"}}>
                            <Card.Title className={"text-truncate"}>{recipe.name}</Card.Title>
                            <Card.Text className="text-truncate" style={{height:"1.5em", textDecoration: 'none'}}>
                                {recipe.description == null ? "No description available" : recipe.description}
                            </Card.Text>
                            <div style={{textAlign: "center"}}>
                                <table style={{marginLeft:"auto", marginRight:"auto", borderCollapse:"separate", borderSpacing:"2em 0em"}}><tbody>
                                <tr>
                                    <th style={{fontSize:"95%"}}> {recipe.time_to_cook} </th>
                                    <th style={{fontSize:"95%"}}> {recipe.serving_size} </th>
                                    <th style={{fontSize:"95%"}}> {recipe.type} </th>
                                    <th style={{fontSize:"95%"}}> {recipe.calories == null ? "N/A" : recipe.calories }</th>
                                </tr>
                                <tr>
                                    <td style={{fontSize:"80%"}}> MINS </td>
                                    <td style={{fontSize:"80%"}}> SERVES </td>
                                    <td style={{fontSize:"80%"}}> MEAL </td>
                                    <td style={{fontSize:"80%"}}> CAL </td>
                                </tr>
                                </tbody></table>
                            </div>

                        </Card.Body>


                    <Card.Footer
                        className={"text-truncate"}>
                        <Row>
                            <Col sm={2} className={"mx-auto my-auto"}>
                                <Link  to={"/profile/" + recipe.user_id} >
                                <Image src={"http://127.0.0.1:5000/img/" + recipe.profile_pic_path} alt="Profile Picture" roundedCircle width="40em"/>
                                </Link>
                            </Col>
                            <Col sm={10}>
                                <Link to={"/profile/" + recipe.user_id} > {recipe.first_name + " " + recipe.last_name} <br/> </Link>
                                <small className={"text-muted"}>

                                    {"Created "}
                                    <ReactTimeAgo date={new Date(recipe.creation_time)} locale="en-US"/>
                                    {recipe.edit_time != null ? <>
                                            {" | Modified "}
                                            <ReactTimeAgo date={new Date(recipe.edit_time)} locale="en-US"/> </>
                                        : ""}
                                </small>
                            </Col>
                        </Row>
                    </Card.Footer>
                        </div>
                </Card>
            </div>
        )
    }

    function navigatePage(page_) {
        history.push('/newsfeed/' + page_);
        history.go();
    }

    return (
        <>
        <Helmet>
            <title> Newsfeed - MyRecipes </title>
        </Helmet>
        <Container  style={{marginTop:'1em', marginBottom:"2em"}}>
            <Row>
            <Col sm={3}>
                {!fetchedProfile ?
                <div style={{textAlign: "center"}}>
                    <br/>
                    <Spinner animation={"grow"}/>
                </div>
                :
                <>
                <Row>
                    <Col>
                    <Modal.Dialog>
                    <Modal.Body>
                        <Row>
                            <Col style={{textAlign:"center"}}>
                                <Image src={"http://127.0.0.1:5000/img/" + imgUrl} alt="Profile Picture" roundedCircle width="70em"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{textAlign:"center"}}>
                                <h4>{firstName} {lastName}</h4>
                            </Col>
                        </Row>
                        <Row style={{textAlign:"center"}}>
                            <Col>
                            <table style={{marginLeft:"auto", marginRight:"auto", borderCollapse:"separate", borderSpacing:"1em 0em"}}><tbody>
                                <tr>
                                    <th style={{fontSize:"150%"}}> {recipeCount} </th>
                                    <th style={{fontSize:"150%"}}>
                                        <Subscribers subscribers={subscribers} />
                                    </th>
                                </tr>
                                <tr>
                                    <td> RECIPES </td>
                                    <td> SUBSCRIBERS </td>
                                </tr>
                            </tbody></table>
                            </Col>
                        </Row>
                    </Modal.Body>
                    </Modal.Dialog>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <ListGroup>
                        <ListGroup.Item variant="primary">Subscriptions</ListGroup.Item>
                        {subscriptions.map(({first_name, last_name, user_id, profile_pic_path}, index)=>
                            <ListGroup.Item key={index}>
                            <Link to={"/profile/" + user_id}  style={{width:"100%"}}>
                                <Row>
                                <Col sm={3}>
                                <Image src={"http://127.0.0.1:5000/img/" + profile_pic_path} alt="Profile Picture" roundedCircle width="40em"/>
                                </Col>
                                <Col >
                                    {first_name} {last_name}
                                </Col>
                                </Row>
                                </Link>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                    </Col>
                </Row>
                </>
                }
            </Col>
            <Col sm={9}>
                {!fetchedFeed ?
                <div style={{textAlign: "center"}}>
                    <br/>
                    <Spinner animation={"grow"}/>
                </div>
                :
                <>
                <Row>
                    <Col>
                    {recipes.length === 0 ? <Modal.Dialog><Modal.Body>No recipes found</Modal.Body></Modal.Dialog>: recipes.map(generateCard)}
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Pagination style={{padding:"1em"}}>
                        {[...Array(pages).keys()].map(i => 
                            <Pagination.Item key={i} active={i+1 === activePage} onClick={()=>navigatePage(i+1)}>{i+1}</Pagination.Item>
                        )}
                    </Pagination>
                    </Col>
                </Row>
                </>
                }
            </Col>
            </Row>
        </Container>
        </>
    );
}

export default Feed;