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

import { Helmet } from "react-helmet-async";
import Like from "../Like.svg";
import Comment from "../comment_black_24dp.svg";

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
    const [hoveredProfile, setHoveredProfile] = useState(false)
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
                        <Card.Header
                            className={"text-truncate"}>
                            <Row>
                                <Col sm={1} className={"mx-auto my-auto"}>
                                    <Link  to={"/profile/" + recipe.user_id} >
                                        <Image onClick={(e) => e.stopPropagation()} src={"http://127.0.0.1:5000/img/" + recipe.profile_pic_path} alt="Profile Picture" roundedCircle width="40em"/>
                                    </Link>
                                </Col>
                                <Col sm={11}>
                                    <Link to={"/profile/" + recipe.user_id} >
                                        <div onClick={(e) => e.stopPropagation()}>
                                            {recipe.first_name + " " + recipe.last_name} <br/>
                                        </div>
                                    </Link>

                                        {"Created "}
                                        <ReactTimeAgo date={new Date(recipe.creation_time)} locale="en-US"/>
                                        {recipe.edit_time != null ? <>
                                                {" | Modified "}
                                                <ReactTimeAgo date={new Date(recipe.edit_time)} locale="en-US"/> </>
                                            : ""}
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Img variant="Top" style={{width:"100%", height:"9vw", objectFit:"cover"}} alt="Recipe Image" src={recipe.photo_path == null ? "http://127.0.0.1:5000/img/default_recipe.png" : "http://127.0.0.1:5000/img/" + recipe.photo_path}/>
                        <Card.Body style={{textAlign: "center"}}>

                            <Card.Title className={"text-truncate"}>{recipe.name}
                            </Card.Title>
                            <Card.Text className="text-truncate" style={{height:"1.5em", textDecoration: 'none'}}>
                                {recipe.description == null ? "No description available" : recipe.description}
                            </Card.Text>
                            <Card.Text>
                                
                            </Card.Text>
                            <Row>
                                <Col sm={3} />
                                <Col sm={6} style={{textAlign: "center"}}>
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
                                </Col>
                                <Col sm={3} style={{textAlign:"right"}}>
                                    <Image src={Like} style={{height:"35%"}}/>
                                    <span style={{fontSize: "125%", verticalAlign: "middle"}}> {recipe.likes} </span>
                                    <Image src={Comment} style={{height:"40%"}}/>
                                    <span style={{fontSize: "125%", verticalAlign: "middle"}}> {recipe.comments} </span>
                                </Col>
                            </Row>

                        </Card.Body>



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
                    <Spinner style={{color:'tomato'}} animation={"grow"}/>
                </div>
                :
                <>
                <Row>
                    <Col>
                    <div style={{cursor:'pointer'}} role="link" onClick={()=>history.push("/profile")} >
                    <Modal.Dialog
                        onMouseEnter={()=> setHoveredProfile(true)}
                        onMouseLeave={()=> setHoveredProfile(false)}
                        className={hoveredProfile ? 'shadow-lg' : 'shadow-sm'}>
                        <Modal.Header>
                            <Col style={{textAlign: "center", fontSize:"125%"}}> Your Profile  </Col>
                        </Modal.Header>
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
                                    <th style={{fontSize:"150%"}}> {subscribers.length} </th>
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
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {subscriptions.length === 0 ? null :
                        <ListGroup>
                            <ListGroup.Item variant="primary">Subscriptions</ListGroup.Item>
                            { subscriptions.map(({first_name, last_name, user_id, profile_pic_path}, index)=>
                                <ListGroup.Item key={index}>
                                <Link  to={"/profile/" + user_id} style={{width:"100%"}}>
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
                        </ListGroup> }
                    </Col>
                </Row>
                </>
                }
            </Col>
            <Col sm={9}>
                {!fetchedFeed ?
                <div style={{textAlign: "center"}}>
                    <br/>
                    <Spinner style={{color:'tomato'}} animation={"grow"}/>
                </div>
                :
                <>
                <Row>
                    <Col>
                        {subscriptions.length === 0 ?
                            <Modal.Dialog style={{textAlign: "center"}}> <Modal.Title style={{padding:"1em"}}> You haven't subscribed to anyone. </Modal.Title> <Modal.Body>
                                Visit a profile and select Subscribe, and your newsfeed will show their most recent recipes. </Modal.Body> </Modal.Dialog>
                            : (recipes.length === 0 ?
                                <Modal.Dialog><Modal.Body>Your subscriptions have not created recipes.</Modal.Body> </Modal.Dialog>:
                                recipes.map(generateCard))}
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