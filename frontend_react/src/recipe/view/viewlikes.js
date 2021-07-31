/**
 * Component providing the like button and like count on the recipe page.
 */

import React, { useEffect, useState } from "react";
import Cookie from "universal-cookie";
import Image from "react-bootstrap/Image";
import Liked from "../../images/Like.png";
import NotLiked from "../../images/NotLiked.svg";
import Row from "react-bootstrap/Row";
import ProfileListModal from "../../profile/listmodal.js";

/**
 * Performs the API request for /recipe/like and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param recipe_id - the recipe_id of the recipe to like
 */
async function requestLike(recipe_id, token) {
    let response = await fetch("http://localhost:5000/recipe/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify({
            recipe_id: recipe_id,
        }),
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

/**
 * Performs the API request for /recipe/isliked and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param recipe_id - the recipe_id of the recipe to check whether the user liked
 */
async function getLikedStatus(recipe_id, token) {
    let response = await fetch(
        "http://localhost:5000/recipe/is_liked?" +
            new URLSearchParams({ recipe_id: recipe_id }),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        }
    ).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function RecipeViewLikes(props) {
    // Whether this recipe has been liked
    const [liked, setLiked] = useState(false);

    // Fetch status of the number of likles
    const [likeFetched, setLikeFetched] = useState(false);

    // Whether the like button is currently being clicked (to support like animation)
    const [likeClicked, setLikeClicked] = useState(false);

    const cookie = new Cookie();

    function showError(errorText) {
        props.setErrorShow(true);
        props.setErrorText(errorText);
    }

    /**
     * Calls and awaits for the liked request function and sets the component state
     * based on the response.
     */
    async function processLiked() {
        let response = await getLikedStatus(
            props.recipeId,
            cookie.get("token")
        ).catch((e) => {});

        if (response != null) {
            setLiked(response.is_liked);
        }
        setLikeFetched(true);
    }

    /**
     * Handles the clicking of like by awaiting on the request like function.
     * Updates the like count accordingly.
     */
    async function handleLike() {
        let response = await requestLike(
            props.recipeId,
            cookie.get("token")
        ).catch((e) => {
            // handle error
        });
        if (response != null) {
            if (liked) {
                setLiked(false);
            } else {
                setLiked(true);
            }
            props.setLikes(response);
        }
    }

    useEffect(() => {
        if (!likeFetched && props.loggedIn) processLiked();
    }, []);

    return (
        <>
            <Row
                style={{ textAlign: "center", justifyContent: "center" }}
                className={"mx-auto align-content-center"}
            >
                <Image
                    style={{
                        cursor: "pointer",
                        height: likeClicked ? "2em" : "2.5em",
                        width: "auto",
                        marginTop: likeClicked ? "0.2em" : null,
                        marginLeft: likeClicked ? "0.05em" : null,
                    }}
                    onMouseLeave={
                        props.loggedIn ? () => setLikeClicked(false) : null
                    }
                    onMouseDown={
                        props.loggedIn ? () => setLikeClicked(true) : null
                    }
                    onMouseUp={
                        props.loggedIn ? () => setLikeClicked(false) : null
                    }
                    src={liked ? Liked : NotLiked}
                    onClick={
                        props.loggedIn
                            ? () => handleLike()
                            : () => showError("Log in to like this recipe")
                    }
                />
            </Row>
            <Row
                style={{ textAlign: "center", justifyContent: "center" }}
                className={"mx-auto align-content-center"}
            >
                <ProfileListModal
                    title="Liked by"
                    data={props.likes}
                    style={{
                        width: "2em",
                        textAlign: "center",
                        fontSize: props.likes.length < 9999 ? "150%" : "100%",
                        color: liked ? "tomato" : "black",
                        marginTop: likeClicked ? "0.2em" : null,
                        verticalAlign: "middle",
                    }}
                />
            </Row>
        </>
    );
}

export default RecipeViewLikes;
