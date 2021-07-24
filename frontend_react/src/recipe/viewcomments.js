import React, { useState } from 'react';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Cookie from 'universal-cookie';
import Button from 'react-bootstrap/esm/Button';
import ListGroup from "react-bootstrap/ListGroup";
import ReactTimeAgo from "react-time-ago";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {Link, useHistory} from "react-router-dom";

async function requestComment(token, recipe_id, comment) {
    let response = await fetch('http://localhost:5000/recipe/comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            comment: comment,
            recipe_id: recipe_id
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

async function requestCommentDelete(token, comment_id) {
    let response = await fetch('http://localhost:5000/recipe/comment/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            comment_id: comment_id,
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function RecipeViewComments(props) {
    const [comment, setComment] = useState('');
    const cookie = new Cookie();
    const history = useHistory()


    async function handleSubmit(e) {
        e.preventDefault();

        let response = await requestComment(cookie.get('token'), props.recipeId, comment)
            .catch(e => {
            });

        if (response != null) {
            setComment('');
            props.setComments(response);
        }
    }

    async function handleDelete(commentId) {
        let response = await requestCommentDelete(cookie.get('token'), commentId)
            .catch(e => {
            });

        if (response != null) {
            props.setComments(response)
        }
    }

    return (<>
        <Row style={{marginTop:"1em"}}>
            <Col sm={1} />
            <Col sm={11}>
                <h3> {props.comments.length} {props.comments.length === 1 ? "Comment" : "Comments"}</h3>
                {props.loggedIn ?
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col sm={11} >
                            <Form.Control placeholder="Comment here" onChange={(e) => setComment(e.target.value)} required/>
                        </Col>
                        <Col sm={1} style={{paddingLeft:"0"}} >
                            <Button type="submit" variant="secondary" >Post</Button>
                        </Col>
                    </Row>
                </Form> : <div> Log in to leave a comment </div>}
                <br/>
                <ListGroup>
                    {props.comments.map(({first_name, last_name, user_id, profile_pic_path, comment_id, by_user_id, comment_text, time_created}, index)=>
                        <ListGroup.Item key={index}>
                            <Row>

                            <Col sm={3} className={"text-truncate my-auto"}>
                            <Link to={"/profile/" + user_id}  style={{width:"100%"}} onClick={() => {history.push("/profile/"+user_id);history.go(0);}}>

                                <Image src={"http://127.0.0.1:5000/img/" + profile_pic_path} alt="Profile Picture" roundedCircle width="40em" style={{marginRight:"1em"}}/>
                                {first_name} {last_name}

                            </Link>
                                {user_id == props.contributorID ?
                                <span style={{
                                                marginLeft:"1em",
                                                marginRight: "auto",
                                                fontSize: "85%",
                                                backgroundColor: "tomato",
                                                color: "white",
                                                borderRadius: "5px 5px 5px 5px",
                                                height: "1.5em",
                                                width: "10em",
                                                marginBottom:"1em"

                                            }}>
                                 &nbsp; OP &nbsp;
                                  </span> : null}
                            </Col>
                            <Col sm={6} className={"my-auto"}>
                                {comment_text}
                            </Col>
                            <Col sm={2} className={"my-auto"}>
                                <ReactTimeAgo date={new Date(time_created)} locale="en-US"/>
                            </Col>
                            <Col sm={1} style={{textAlign:"right"}} className={"my-auto align-content-center"}>
                                {props.currId === by_user_id ?
                                <DropdownButton size="sm">
                                    <Dropdown.Item onClick={()=>handleDelete(comment_id)} >Delete</Dropdown.Item>
                                </DropdownButton>
                                :null}
                            </Col>
                            </Row>
                        </ListGroup.Item>
                    )}
                </ListGroup>
                <br />

            </Col>
        </Row>
    </>);
}
                    
export default RecipeViewComments;