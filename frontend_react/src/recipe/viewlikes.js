import React, {useEffect, useState} from "react";
import Cookie from "universal-cookie";
import Image from "react-bootstrap/Image";
import Liked from "../Like.png";
import NotLiked from "../NotLiked.svg";

import Col from "react-bootstrap/Col";
import {Tooltip} from "@material-ui/core";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";

async function requestLike(recipe_id, token) {
        let response = await fetch('http://localhost:5000/recipe/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                recipe_id: recipe_id,
            })
        }).catch(e => {
            throw new Error(e);
        });

        let responseJson = await response.json();

        if (response.ok) return responseJson;
        else throw new Error(responseJson.error);
}

async function getLikedStatus(recipe_id, token) {
        let response = await fetch('http://localhost:5000/recipe/is_liked?' + new URLSearchParams({'recipe_id': recipe_id}), {
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

function RecipeViewLikes(props) {
    const [liked, setLiked] = useState(false)
    const [likeFetched, setLikeFetched] = useState(false)
    const [likeSuccess, setLikeSuccess] = useState(false)
    const [likeHovered, setLikeHovered] = useState(false)
    const [likeClicked, setLikeClicked] = useState(false)

    const cookie = new Cookie();

    function showError(errorText) {
        props.setErrorShow(true)
        props.setErrorText(errorText)
    }

    async function processLiked() {

        let response = await getLikedStatus(props.recipeId, cookie.get('token'))
            .catch(e => {
                setLikeSuccess(false)
            });

        if (response != null) {
            setLiked(response.is_liked)
            setLikeSuccess(true)
        }
        setLikeFetched(true);
    }



    async function handleLike() {
        let response = await requestLike(props.recipeId, cookie.get('token'))
            .catch(e => {
                // handle error
            });
        if (response != null) {
            if (liked) {
                setLiked(false)
                props.setLikes(props.likes - 1);
            } else {
                setLiked(true)
                props.setLikes(props.likes + 1);
            }

        }
    }


    useEffect(() => {
        if (!likeFetched && props.loggedIn) processLiked();
    }, []);

    return (
        <>
            <Image
                    style={{cursor: "pointer", height: likeClicked ? "20%" : "25%", width:"auto", marginTop: likeClicked ? "0.2em": null, marginLeft: likeClicked ? "0.05em" : null}}
                    onMouseLeave={()=>setLikeClicked(false)}
                    onMouseDown={props.loggedIn ? ()=>setLikeClicked(true) : null}
                    onMouseUp={props.loggedIn ? ()=>setLikeClicked(false) : null}
                    src={liked ? Liked : NotLiked}
                    onClick={props.loggedIn ? () => handleLike() : ()=>showError("Log in to like this recipe")}
            />
            <Row style={{textAlign: "center"}} className={"mx-auto align-content-center"}>
                <p style={{width:"2em", fontSize: props.likes < 9999 ?  "150%" : "125%", color: liked ? "tomato" : "black", marginLeft: "auto", marginRight:"auto", marginTop: likeClicked ? "0.25em": null, verticalAlign: "middle"}}> { props.likes}</p>
            </Row>
        </>
    )
}
export default RecipeViewLikes;