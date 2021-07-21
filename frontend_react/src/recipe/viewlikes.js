import React, {useEffect, useState} from "react";
import Cookie from "universal-cookie";
import Image from "react-bootstrap/Image";
import Liked from "../iconmonstr-favorite-3.svg";
import NotLiked from "../iconmonstr-heart-thin.svg";
import Col from "react-bootstrap/Col";
import {Tooltip} from "@material-ui/core";
import Alert from "react-bootstrap/Alert";

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
    const [errorShow, setErrorShow] = useState(false)
    const [errorText, setErrorText] = useState("Unknown error")

    const cookie = new Cookie();

    function showError(errorText) {
        setErrorShow(true)
        setErrorText(errorText)
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
                    style={{cursor: "pointer", width: likeClicked ? "40%" : "50%", height:"auto"}}
                    onMouseLeave={()=>setLikeClicked(false)}
                    onMouseDown={props.loggedIn ? ()=>setLikeClicked(true) : null}
                    onMouseUp={props.loggedIn ? ()=>setLikeClicked(false) : null}
                    src={liked ? Liked : NotLiked}
                    onClick={props.loggedIn ? () => handleLike() : ()=>showError("Log in to like this recipe")}
            />

                    <h4> { props.likes}</h4>
            <Alert show={errorShow} variant="danger" style={{marginTop:"1em"}} onClose={() => setErrorShow(false)} dismissible>
                                        {errorText}
            </Alert>
        </>
    )
}
export default RecipeViewLikes;