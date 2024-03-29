/**
 * Component providing description section for the recipe page, including the
 * statistics table and the description.
 * Also provides the 'edit photos' 'edit description' and 'delete recipe' options
 */

import React, { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Cookie from "universal-cookie";

import { EditPhoto } from "./viewphoto.js";
import RecipeDelete from "./viewdelete.js";
import Dropdown from "react-bootstrap/Dropdown";
import RecipeViewLikes from "./viewlikes";

/**
 * Performs the API request for /recipe/editdescription and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param recipe_id - the recipe_id of the recipe to edit
 * @param name - the new name of the recipe
 * @param type - the new type of the recipe
 * @param time - the new time to cook for the recipe
 * @param serving_size - the new serving size of the recipe
 * @param description - the new description of the recipe
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestEditDesc(
    token,
    recipe_id,
    name,
    type,
    time,
    serving_size,
    description
) {
    let response = await fetch("http://localhost:5000/recipe/editdescription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify({
            name: name,
            type: type,
            time: time,
            serving_size: serving_size,
            description: description,
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
 * This is a component providing the modal popup for editing the description.
 */
function EditDesc(props) {
    // Closes the 'Edit Description' modal popup (i.e. this)
    const editClose = () => {
        setSuccessShow(false);
        setErrorShow(false);
        props.setShowDescEdit(false);
        props.setChatbotVisible(true);
    };

    // Stores the state of the fields in the description section
    const [name, setName] = useState(props.recipeName);
    const [type, setType] = useState(props.mealType);
    const [time, setTime] = useState(props.time);
    const [serving, setServing] = useState(props.serving);
    const [description, setDescription] = useState(props.description);

    // Whether to show the error box
    const [errorShow, setErrorShow] = useState(false);
    // The text to show in the error box
    const [errorText, setErrorText] = useState("");
    // Whether to show the success box
    const [successShow, setSuccessShow] = useState(false);

    const cookie = new Cookie();

    /**
     * Handles the pressing of the submit edit button by performing and awaiting
     * the request to edit
     * @param event: the onSubmit event
     */
    async function handleSubmit(event) {
        event.preventDefault();

        let response = await requestEditDesc(
            cookie.get("token"),
            props.recipeId,
            name,
            type,
            time,
            serving,
            description === "null" || description === "" ? null : description
        ).catch((e) => {
            setErrorShow(true);
            setSuccessShow(false);
            setErrorText(e.message);
        });

        if (response != null) {
            setErrorShow(false);
            props.setRecipeName(name);
            props.setMealType(type);
            props.setTime(time);
            props.setServing(serving);
            props.setDescription(description);
            props.setEditedAt(response["edit_time"]);
            setSuccessShow(true);
        }
    }

    return (
        <Modal show={props.showDescEdit} onHide={editClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                onChange={(e) => setName(e.target.value)}
                                required
                                defaultValue={name}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                onChange={(e) => setType(e.target.value)}
                                required
                                defaultValue={type}
                            >
                                <option>Breakfast</option>
                                <option>Brunch</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Snack</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Time (minutes)</Form.Label>
                            <Form.Control
                                onChange={(e) => setTime(e.target.value)}
                                type="number"
                                required
                                defaultValue={time}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Serving size</Form.Label>
                            <Form.Control
                                onChange={(e) => setServing(e.target.value)}
                                type="number"
                                required
                                defaultValue={serving}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row style={{ marginTop: "1em" }}>
                        <Form.Group as={Col}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                onChange={(e) => setDescription(e.target.value)}
                                defaultValue={description}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Alert
                        show={errorShow}
                        variant="danger"
                        onClose={() => setErrorShow(false)}
                        dismissible
                    >
                        {errorText}
                    </Alert>
                    <Alert
                        show={successShow}
                        variant="success"
                        onClose={() => setSuccessShow(false)}
                        dismissible
                    >
                        Successfully updated recipe details
                    </Alert>
                    <div style={{ textAlign: "center" }}>
                        <Button type="submit" size="sm">
                            Confirm
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

/**
 * This is a component providing only the description block of the recipe
 */
export function RecipeViewDescription(props) {
    return (
        <>
            <Row style={{ marginTop: "1em" }}>
                <Col>
                    <h3> Description </h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListGroup className={"shadow-sm"}>
                        <ListGroup.Item style={{ textAlign: "justify" }}>
                            {props.description == null
                                ? "No description available"
                                : props.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </>
    );
}

/**
 * This is a component providing the entire description section of the recipe.
 */
function RecipeViewDesc(props) {
    // Whether to show the edit modal
    const [showDescEdit, setShowDescEdit] = useState(false);
    // Shows the edit modal
    const descEditShow = () => {
        setShowDescEdit(true);
        props.setChatbotVisible(false);
    };

    // Whether to show the edit photos modal
    const [showPhotoEdit, setShowPhotoEdit] = useState(false);
    const photoEditShow = () => {
        setShowPhotoEdit(true);
        props.setChatbotVisible(false);
    };

    // Whether to show the delete modal
    const [showDelete, setShowDelete] = useState(false);
    const deleteShow = () => {
        setShowDelete(true);
        props.setChatbotVisible(false);
    };

    // Whether to show the error box
    const [errorShow, setErrorShow] = useState(false);
    // The text to show in the error box
    const [errorText, setErrorText] = useState("");

    return (
        <>
            <Alert
                show={errorShow}
                variant="warning"
                style={{ marginTop: "1em" }}
                onClose={() => setErrorShow(false)}
                dismissible
            >
                {errorText}
            </Alert>
            <Row>
                <Col sm={3} />
                <Col sm={6}>
                    <Row>
                        <Col>
                            <div style={{ textAlign: "center" }}>
                                <h1>{props.recipeName}</h1>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ textAlign: "center" }}>
                        <Col>
                            <table
                                style={{
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    borderCollapse: "separate",
                                    borderSpacing: "2em 0em",
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <th style={{ fontSize: "200%" }}>
                                            {" "}
                                            {props.time}{" "}
                                        </th>
                                        <th style={{ fontSize: "200%" }}>
                                            {" "}
                                            {props.serving}{" "}
                                        </th>
                                        <th style={{ fontSize: "200%" }}>
                                            {" "}
                                            {props.mealType}{" "}
                                        </th>
                                        <th style={{ fontSize: "200%" }}>
                                            {" "}
                                            {props.calories == null
                                                ? "N/A"
                                                : props.calories}{" "}
                                        </th>
                                    </tr>
                                    <tr>
                                        <td> MINS</td>
                                        <td> SERVES</td>
                                        <td> MEAL</td>
                                        <td> APPROX CAL</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Col>

                {props.editable ? (
                    <>
                        <Col sm={1} style={{ textAlign: "center" }}>
                            <RecipeViewLikes
                                setErrorShow={setErrorShow}
                                setErrorText={setErrorText}
                                loggedIn={props.loggedIn}
                                recipeId={props.recipeId}
                                likes={props.likes}
                                setLikes={props.setLikes}
                            />
                        </Col>
                        <Col sm={2}>
                            <Row>
                                <Col style={{ textAlign: "right" }}>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={photoEditShow}
                                        size="sm"
                                    >
                                        Edit photos
                                    </Button>
                                </Col>
                            </Row>
                            <Row
                                style={{ marginTop: "1em", textAlign: "right" }}
                            >
                                <Col>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={descEditShow}
                                        size="sm"
                                    >
                                        Edit details
                                    </Button>
                                </Col>
                            </Row>
                            <Row
                                style={{ marginTop: "1em", textAlign: "right" }}
                            >
                                <Col>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            size="sm"
                                            variant="outline-secondary"
                                            id="dropdown-basic"
                                        >
                                            More options
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={deleteShow}
                                                style={{ color: "red" }}
                                                size="sm"
                                            >
                                                {" "}
                                                Delete recipe{" "}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </Col>
                    </>
                ) : (
                    <>
                        <Col sm={2}></Col>
                        <Col sm={1} style={{ textAlign: "center" }}>
                            <RecipeViewLikes
                                setErrorShow={setErrorShow}
                                setErrorText={setErrorText}
                                loggedIn={props.loggedIn}
                                recipeId={props.recipeId}
                                likes={props.likes}
                                setLikes={props.setLikes}
                            />
                        </Col>
                    </>
                )}
            </Row>
            <EditDesc
                showDescEdit={showDescEdit}
                setShowDescEdit={setShowDescEdit}
                recipeId={props.recipeId}
                recipeName={props.recipeName}
                setRecipeName={props.setRecipeName}
                time={props.time}
                setTime={props.setTime}
                serving={props.serving}
                setServing={props.setServing}
                mealType={props.mealType}
                setMealType={props.setMealType}
                setEditedAt={props.setEditedAt}
                description={props.description}
                setDescription={props.setDescription}
                setChatbotVisible={props.setChatbotVisible}
            />
            <EditPhoto
                showPhotoEdit={showPhotoEdit}
                setShowPhotoEdit={setShowPhotoEdit}
                recipeId={props.recipeId}
                photos={props.photos}
                setPhotos={props.setPhotos}
                setEditedAt={props.setEditedAt}
                setChatbotVisible={props.setChatbotVisible}
            />
            <RecipeDelete
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                recipeId={props.recipeId}
                setDeleted={props.setDeleted}
                setChatbotVisible={props.setChatbotVisible}
            />
        </>
    );
}

export default RecipeViewDesc;
