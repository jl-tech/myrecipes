import React, {useState} from 'react';
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
    const [loadCommentsTo, setLoadCommentsTo] = useState(5)
    const [currSort, setCurrSort] = useState("oldest")
    const cookie = new Cookie();
    const history = useHistory()


    async function handleSubmit(e) {
        e.preventDefault();
        setComment("")
        let response = await requestComment(cookie.get('token'), props.recipeId, comment)
            .catch(e => {
            });

        if (response != null) {
            setComment('');
            props.setComments(currSort === "oldest" ? response : response.reverse());
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

    function sortChange(e) {
        switch (e.target.value) {
            case "0":
                if (currSort === "newest") {
                    setCurrSort("oldest")
                    setLoadCommentsTo(5)
                    props.setComments(props.comments.reverse())
                }
                break
            case "1":
                if (currSort === "oldest") {
                    setCurrSort("newest")
                    setLoadCommentsTo(5)
                    props.setComments(props.comments.reverse())
                }
                break
        }
    }

    return (<>
        <Row style={{marginTop: "1em"}}>
            <Col sm={1}/>
            <Col sm={11}>
                <h3> {props.comments.length} {props.comments.length === 1 ? "Comment" : "Comments"}</h3>
                <Form>
                    Sort by:
                    <Form.Control as="select" style={{width: "30%"}}
                                  onChange={(e) => sortChange(e)}>
                        <option value="0">Oldest</option>
                        <option value="1">Newest</option>

                    </Form.Control>
                    <br/>
                </Form>
                {props.loggedIn ?
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col sm={11}>
                                <Form.Control value={comment}
                                              placeholder="Leave a comment"
                                              onChange={(e) => setComment(e.target.value)}
                                              required/>
                            </Col>
                            <Col sm={1} style={{paddingLeft: "0"}}>
                                <Button type="submit"
                                        variant="secondary">Post</Button>
                            </Col>
                        </Row>
                    </Form> :
                    <div><Link to={"/login"}> Log in</Link> to leave a comment
                    </div>}
                <br/>

                <ListGroup>
                    {props.comments.slice(0, loadCommentsTo).map(({
                                                                      first_name,
                                                                      last_name,
                                                                      user_id,
                                                                      profile_pic_path,
                                                                      comment_id,
                                                                      by_user_id,
                                                                      comment_text,
                                                                      time_created
                                                                  }, index) =>
                        <ListGroup.Item className={"shadow-sm border-top"}
                                        key={index} style={{
                            marginBottom: "1em",
                            paddingLeft: "2em",
                            paddingRight: "2em"
                        }}>
                            <Row>
                                <Link to={"/profile/" + user_id}
                                      onClick={() => {
                                          history.push("/profile/" + user_id);
                                          history.go(0);
                                      }}>

                                    <Image
                                        src={"http://127.0.0.1:5000/img/" + profile_pic_path}
                                        alt="Profile Picture" roundedCircle
                                        width="40em"
                                        style={{marginRight: "1em"}}/>
                                    {first_name} {last_name}
                                </Link>

                                {user_id === props.contributorID ?
                                    <span style={{
                                        marginTop: "0.4em",
                                        marginLeft: "1em",
                                        fontSize: "85%",
                                        backgroundColor: "tomato",
                                        color: "white",
                                        borderRadius: "5px 5px 5px 5px",
                                        height: "1.5em",
                                        width: "6em",
                                        marginBottom: "1em",
                                        textAlign: "center",
                                        verticalAlign: "middle"

                                    }}>
                                 &nbsp; CREATOR &nbsp;
                                  </span> : null}
                                {props.currId === by_user_id ? (<>
                                    <span style={{
                                        marginTop: "0.35em",
                                        marginLeft: "1em",
                                        fontSize: "85%",
                                        backgroundColor: "tomato",
                                        color: "white",
                                        borderRadius: "5px 5px 5px 5px",
                                        height: "1.5em",
                                        width: "4em",
                                        marginBottom: "1em",
                                        textAlign: "center",
                                        verticalAlign: "middle"
                                    }}>
                                        &nbsp; YOU &nbsp;
                                  </span>
                                        <DropdownButton size="sm"
                                                        style={{marginLeft: "auto"}}>
                                            <Dropdown.Item
                                                onClick={() => handleDelete(comment_id)}>Delete</Dropdown.Item>
                                        </DropdownButton></>)
                                    : null}
                            </Row>
                            <Row style={{
                                fontSize: "115%",
                                marginBottom: "0.2em"
                            }}>
                                {comment_text}
                            </Row>
                            <Row>
                                <small className={'text-muted'}>
                                    <ReactTimeAgo date={new Date(time_created)}
                                                  locale="en-US"/>
                                </small>
                            </Row>
                        </ListGroup.Item>
                    )}
                </ListGroup>
                {loadCommentsTo < props.comments.length ?
                    <Button variant={"outline-secondary"}
                            onClick={() => setLoadCommentsTo(loadCommentsTo + 5)}> Show
                        more... </Button> :
                    null
                }
                <br/>

            </Col>
        </Row>
    </>);
}

export default RecipeViewComments;