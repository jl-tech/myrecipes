/**
 * Component providing the delete confirmation modal popup for the recipe page.
 */
import React, { useState } from "react";

import Button from "react-bootstrap/Button";

import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Cookie from "universal-cookie";

/**
 * Performs the API request for /recipe/delete and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param recipe_id - the recipe_id of the recipe to delete
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestDelete(token, recipe_id) {
    let response = await fetch("http://localhost:5000/recipe/delete", {
        method: "DELETE",
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

function RecipeDelete(props) {
    // hides this modal
    const hideDelete = () => {
        props.setShowDelete(false);
        props.setChatbotVisible(true);
    };

    // Whether to show the error box
    const [errorShow, setErrorShow] = useState(false);
    // The text to show in the error box
    const [errorText, setErrorText] = useState("");

    const cookie = new Cookie();

    /**
     * Handles the pressing of the delete button by performing and awaiting
     * the request to delete
     */
    async function handleSubmit() {
        let response = await requestDelete(
            cookie.get("token"),
            props.recipeId
        ).catch((e) => {
            setErrorShow(true);
            setErrorText(e.message);
        });

        if (response != null) {
            props.setDeleted(true);
        }
    }

    return (
        <Modal show={props.showDelete} onHide={hideDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this recipe? This action cannot
                be undone!
                <Alert
                    show={errorShow}
                    variant="danger"
                    onClose={() => setErrorShow(false)}
                    dismissible
                >
                    {errorText}
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={hideDelete}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleSubmit}>
                    Delete recipe
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RecipeDelete;
