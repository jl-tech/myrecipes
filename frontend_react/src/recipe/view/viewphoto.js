/**
 * Component providing photos carousel for the recipe page
 * Also, a component providing the edit photos modal
 */

import React, { useState } from "react";
import imageCompression from "browser-image-compression";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import Cookie from "universal-cookie";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import ListGroup from "react-bootstrap/ListGroup";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Reorder from "../../images/reorder_black_24dp.svg";

/**
 * Performs the API request for /recipe/editphotos and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param recipe_id - the recipe_id of the recipe to edit
 * @param photos - new array of photos objects
 * @param names - array of names corresponding to each photo (file names)
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestEditPhotos(token, recipe_id, photos, names) {
    let data = new FormData();
    data.append("recipe_id", recipe_id);
    photos.forEach((photo) => data.append("photos[]", photo));
    data.append("photo_names", names);

    let response = await fetch("http://localhost:5000/recipe/editphotos", {
        method: "POST",
        headers: {
            Authorization: token,
        },
        body: data,
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

/**
 * Edit photos modal
 */
export function EditPhoto(props) {
    const editClose = () => {
        props.setShowPhotoEdit(false);
        props.setChatbotVisible(true);
        setUrl("");
        setUploaded(false);
        setImage(null);
    };

    // The following relates whether to show the error/success boxes and what to
    // show in them
    const [errorShow, setErrorShow] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [errorShow2, setErrorShow2] = useState(false);
    const [errorText2, setErrorText2] = useState("");
    const [successShow, setSuccessShow] = useState(false);

    // Whether the image is uploaded
    const [uploaded, setUploaded] = useState(false);
    // The URL of the uploaded image
    const [url, setUrl] = useState("");
    // The image object uploaded
    const [image, setImage] = useState(null);
    const cookie = new Cookie();

    /**
     * Helper function to convert array format
     */
    function makeJson() {
        let photosP = [];
        let idCountP = 0;
        for (let photo of props.photos) {
            photosP.push({
                id: idCountP.toString(),
                url: photo["url"],
                image: photo["image"],
                name: photo["name"],
            });
            idCountP++;
        }
        return photosP;
    }

    // List of photos
    const [photos, setPhotos] = useState(makeJson());
    // Number of photos
    const [idCount, setIdCount] = useState(photos.length);

    /**
     * Handles the event where the user lets go of the mouse after a drag
     * @param e - the onDragEnd event
     */
    function handleOnDragEnd(e) {
        if (e.destination == null) return;
        const items = Array.from(photos);
        const [selected] = items.splice(e.source.index, 1);
        items.splice(e.destination.index, 0, selected);
        setPhotos(items);
    }

    /*
     * Adds another row (by appending an array element) for a new photo.
     */
    function addRow() {
        if (!uploaded) {
            setErrorShow(true);
            setErrorText("Please upload valid image");
            return;
        }
        let items = Array.from(photos);
        items.push({
            id: idCount.toString(),
            url: url,
            image: image,
            name: image.name,
        });
        setIdCount(idCount + 1);
        setPhotos(items);
        setImage(null);
        setUrl("");
        setUploaded(false);
        document.getElementById("file-upload").value = "";
    }

    /**
     * Remove a photo from the photos array
     * @param index - the index of the photo to remove
     */
    function removePhoto(index) {
        let items = Array.from(photos);
        items.splice(index, 1);
        setPhotos(items);
    }

    /**
     * Performs the upload of the image file and adds it to the image
     * hook.
     * @param event - the onChange event
     * @returns {Promise<void>}
     */
    async function handleImageUpload(event) {
        const imageFile = event.target.files[0];
        const options = {
            maxSizeMB: 0.5,
        };
        if (!imageFile.type.startsWith("image/")) {
            setErrorShow(true);
            setErrorText("File is not image type");
            setImage(null);
            setUrl("");
            setUploaded(false);
            return;
        }
        await imageCompression(imageFile, options)
            .then((compressedFile) => {
                setImage(compressedFile);
                setUrl(URL.createObjectURL(compressedFile));
                setErrorShow(false);
                setUploaded(true);
            })
            .catch((e) => {
                setImage(null);
                setUrl("");
                setUploaded(false);
                setErrorShow(false);
            });
    }

    /**
     * Handles the pressing of the submit edit button by performing and awaiting
     * the request to edit
     * Updates state of the page accordingly or shows error as required.
     */
    async function handleSubmit() {
        let images = [];
        let names = [];
        photos.forEach((photo) => {
            images.push(photo.image);
            names.push(photo.name);
        });

        let response = await requestEditPhotos(
            cookie.get("token"),
            props.recipeId,
            images,
            JSON.stringify(names)
        ).catch((e) => {
            setErrorShow2(true);
            setSuccessShow(false);
            setErrorText2(e.message);
        });

        if (response != null) {
            setErrorShow2(false);
            let photosP = [];
            for (let photo of photos) {
                photosP.push({
                    url: photo.url,
                    image: photo.image,
                    name: photo.name,
                });
            }
            props.setPhotos(photosP);
            props.setEditedAt(response["edit_time"]);
            setSuccessShow(true);
        }
    }

    return (
        <Modal show={props.showPhotoEdit} onHide={editClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Photos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="photos">
                        {(provided) => (
                            <ListGroup
                                as="ul"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ marginBottom: "1em" }}
                            >
                                {photos.map(
                                    ({ id, url, image, name }, index) => {
                                        return (
                                            <Draggable
                                                key={id}
                                                draggableId={id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <ListGroup.Item
                                                        as="li"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Row>
                                                            <Col
                                                                sm={2}
                                                                className={
                                                                    "my-auto"
                                                                }
                                                            >
                                                                {index === 0
                                                                    ? "1 (Main)"
                                                                    : index + 1}
                                                            </Col>
                                                            <Col sm={4}>
                                                                <span>
                                                                    {name}
                                                                </span>
                                                            </Col>
                                                            <Col sm={4}>
                                                                <Image
                                                                    src={url}
                                                                    height="100em"
                                                                />
                                                            </Col>
                                                            <Col
                                                                sm={2}
                                                                className={
                                                                    "my-auto"
                                                                }
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className="close"
                                                                    onClick={() =>
                                                                        removePhoto(
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    <span>
                                                                        ×
                                                                    </span>
                                                                </button>
                                                                <img
                                                                    src={
                                                                        Reorder
                                                                    }
                                                                    alt=""
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                )}
                                            </Draggable>
                                        );
                                    }
                                )}
                                {provided.placeholder}
                                <ListGroup.Item as="li">
                                    {uploaded ? (
                                        <Row>
                                            <Col
                                                style={{ textAlign: "center" }}
                                            >
                                                <Image src={url} width="10%" />
                                            </Col>
                                        </Row>
                                    ) : (
                                        <></>
                                    )}
                                    <Row>
                                        <Col sm={11}>
                                            <Form.File
                                                onChange={(e) =>
                                                    handleImageUpload(e)
                                                }
                                                id="file-upload"
                                            />

                                            <Alert
                                                show={errorShow}
                                                variant="danger"
                                                style={{ marginTop: "1em" }}
                                                onClose={() =>
                                                    setErrorShow(false)
                                                }
                                                dismissible
                                            >
                                                {errorText}
                                            </Alert>
                                        </Col>
                                        <Col sm={1}>
                                            <Button
                                                variant="outline-secondary"
                                                style={{ float: "right" }}
                                                onClick={addRow}
                                                size="sm"
                                            >
                                                Add
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        )}
                    </Droppable>
                </DragDropContext>
                <Alert
                    show={errorShow2}
                    variant="danger"
                    onClose={() => setErrorShow2(false)}
                    dismissible
                >
                    {errorText2}
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
                    <Button type="submit" size="sm" onClick={handleSubmit}>
                        Confirm
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

/**
 * Photos carousel component
 */
function RecipeViewPhoto(props) {
    return (
        <>
            <Row style={{ marginBottom: "1em" }}>
                <Col>
                    <Carousel className={"shadow"}>
                        {props.photos.length === 0 ? (
                            <Carousel.Item
                                key={0}
                                style={{
                                    textAlign: "center",
                                    backgroundColor: "white",
                                }}
                            >
                                <img
                                    src="http://127.0.0.1:5000/img/default_recipe.png"
                                    alt="Default"
                                    style={{ height: "20em" }}
                                />
                            </Carousel.Item>
                        ) : (
                            props.photos.map(({ url }, index) => (
                                <Carousel.Item
                                    key={index}
                                    style={{ textAlign: "center" }}
                                >
                                    <img
                                        src={url}
                                        className="shadow-lg"
                                        alt={`Capture ${index}`}
                                        style={{
                                            zIndex: 1,
                                            position: "absolute",
                                            height: "20em",
                                            width: "auto",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                            left: 0,
                                            right: 0,
                                            textAlign: "center",
                                        }}
                                    />
                                    <img
                                        src={url}
                                        className=""
                                        alt={`Capture ${index} background`}
                                        style={{
                                            objectFit: "cover",
                                            height: "20em",
                                            width: "100%",
                                            filter: "blur(100px) brightness(100%)",
                                        }}
                                    />
                                </Carousel.Item>
                            ))
                        )}
                    </Carousel>
                </Col>
            </Row>
        </>
    );
}

export default RecipeViewPhoto;
