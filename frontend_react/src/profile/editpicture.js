/*
 Component providing the profile pic part of the profile edit page
 */

import React, { useState } from "react";
import imageCompression from "browser-image-compression";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Image from "react-bootstrap/Image";
import Cookie from "universal-cookie";

/**
 * Performs the API request for /profile/removepicture to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function removePicture(token) {
    let response = await fetch("http://localhost:5000/profile/removepicture", {
        method: "GET",
        headers: {
            Authorization: token,
        },
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

/**
 * Performs the API request for /profile/changepicture to the backend and returns
 * result of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting
 * @param image - the new profile pic
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function editPicture(token, image) {
    let data = new FormData();
    data.append("ProfilePicture", image);
    let response = await fetch("http://localhost:5000/profile/changepicture", {
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

function ProfileEditPicture(props) {
    // Whether the picture field is enabled (i.e. in edit mode)
    const [editMode, setEditMode] = useState(false);

    // The following relates whether to show the error/success boxes and what to
    // show in them
    const [errorShow, setErrorShow] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [errorShow2, setErrorShow2] = useState(false);
    const [errorText2, setErrorText2] = useState("");
    const [successShow, setSuccessShow] = useState(false);
    const [successText, setSuccessText] = useState("");

    // whether upload is complete
    const [uploaded, setUploaded] = useState(false);
    // The new image url after upload complete
    const [newUrl, setNewUrl] = useState("");
    // The new image after upload complete
    const [newImage, setNewImage] = useState(null);

    const cookie = new Cookie();

    /**
     * Calls and awaits for the API request function to remove the image.
     * Sets the state of this component based on the response.
     */
    async function handleRemoveImage() {
        let response = await removePicture(cookie.get("token")).catch((e) => {
            setErrorShow2(true);
            setErrorText2(e.message);
        });

        if (response != null) {
            props.setImgUrl(response.url);
            setSuccessShow(true);
            setSuccessText("Successfully removed picture");
        }
    }

    /**
     * Handles the image upload operation
     * @param event - the button click event
     */
    async function handleImageUpload(event) {
        const imageFile = event.target.files[0];
        const options = {
            maxSizeMB: 0.5,
        };
        if (!imageFile.type.startsWith("image/")) {
            setErrorShow(true);
            setErrorText("File is not image type");
            setNewImage(null);
            setNewUrl("");
            setUploaded(false);
            return;
        }
        await imageCompression(imageFile, options)
            .then((compressedFile) => {
                setNewImage(compressedFile);
                setNewUrl(URL.createObjectURL(compressedFile));
                setErrorShow(false);
                setUploaded(true);
            })
            .catch((e) => {
                setNewImage(null);
                setNewUrl("");
                setUploaded(false);
                setErrorShow(false);
            });
    }

    /**
     * Calls and awaits for the API request function to change the image.
     * Sets the state of this component based on the response.
     */
    async function handleSubmit() {
        let response = await editPicture(cookie.get("token"), newImage).catch(
            (e) => {
                setErrorShow(true);
                setErrorText(e.message);
            }
        );

        if (response != null) {
            props.setImgUrl(response.url);
            setNewImage(null);
            setNewUrl("");
            setUploaded(false);
            setErrorShow(false);
            setEditMode(false);
            setSuccessShow(true);
            setSuccessText("Successfully changed picture");
        }
    }

    const cancel = () => {
        setEditMode(false);
        setNewImage(null);
        setNewUrl("");
        setUploaded(false);
    };

    if (!editMode) {
        // Edit mode off, disable change image input and save button
        return (
            <>
                <Row
                    style={{
                        borderTopColor: "gray",
                        borderTopWidth: "1px",
                        borderTopStyle: "solid",
                        paddingTop: "1em",
                        marginTop: "1em",
                    }}
                >
                    <Col sm={8}>
                        <h5>Picture</h5>
                    </Col>
                    <Col sm={2}>
                        {props.imgUrl === "default.png" ? (
                            <></>
                        ) : (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleRemoveImage}
                            >
                                Delete
                            </Button>
                        )}
                    </Col>
                    <Col sm={2}>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ textAlign: "center" }}>
                        <Image
                            src={"http://127.0.0.1:5000/img/" + props.imgUrl}
                            alt="Profile Picture"
                            roundedCircle
                            width="25%"
                        />
                    </Col>
                </Row>
                <Alert
                    show={successShow}
                    variant="success"
                    onClose={() => setSuccessShow(false)}
                    style={{ marginTop: "1em" }}
                    dismissible
                >
                    {successText}
                </Alert>
                <Alert
                    show={errorShow2}
                    variant="danger"
                    style={{ marginTop: "1em" }}
                    onClose={() => setErrorShow2(false)}
                    dismissible
                >
                    {errorText2}
                </Alert>
            </>
        );
    } else {
        // Edit mode on, enable change image input and submit button
        return (
            <>
                <Row
                    style={{
                        borderTopColor: "gray",
                        borderTopWidth: "1px",
                        borderTopStyle: "solid",
                        paddingTop: "1em",
                        marginTop: "1em",
                    }}
                >
                    <Col sm={10}>
                        <h5>Picture</h5>
                    </Col>
                    <Col sm={2}>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={cancel}
                        >
                            Cancel
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ textAlign: "center" }}>
                        <Image src={newUrl} roundedCircle width="25%" />
                    </Col>
                </Row>
                <Row style={{ marginTop: "1em" }}>
                    <Col sm="8" style={{ textAlign: "center" }}>
                        <Form>
                            <Form.File onChange={(e) => handleImageUpload(e)} />
                        </Form>
                    </Col>
                    <Col sm="2" style={{ textAlign: "center" }}>
                        {uploaded ? (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSubmit}
                            >
                                Confirm
                            </Button>
                        ) : (
                            <></>
                        )}
                    </Col>
                </Row>
                <Alert
                    show={errorShow}
                    variant="danger"
                    style={{ marginTop: "1em" }}
                    onClose={() => setErrorShow(false)}
                    dismissible
                >
                    {errorText}
                </Alert>
            </>
        );
    }
}

export default ProfileEditPicture;
