/*
Component for the photos part of the recipe creation page
 */

import React, {useEffect, useState} from "react";
import imageCompression from "browser-image-compression";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";

import Image from "react-bootstrap/Image";

import ListGroup from "react-bootstrap/ListGroup";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Reorder from "../../images/reorder_black_24dp.svg";

function RecipeCreatePhoto({ photos, setPhotos }) {
    // The number of photos in the list
    const [idCount, setIdCount] = useState(0);

    // Whether to show the error box
    const [errorShow, setErrorShow] = useState(false);
    // The text to show in the error box
    const [errorText, setErrorText] = useState("");
    // Whether the image is uploaded
    const [uploaded, setUploaded] = useState(false);
    // The URL of the uploaded image
    const [url, setUrl] = useState("");
    // The image object uploaded
    const [image, setImage] = useState(null);

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
    useEffect(() => {
        addRow();
    }, [uploaded]);
    return (
        <>
            <Form.Label>Photos</Form.Label>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="photos">
                    {(provided) => (
                        <ListGroup
                            as="ul"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {photos.map(({ id, url, image, name }, index) => {
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
                                                        sm={1}
                                                        className={"my-auto"}
                                                    >
                                                        {index === 0
                                                            ? "1 (Main)"
                                                            : index + 1}
                                                    </Col>
                                                    <Col sm={5} className={"my-auto"}>
                                                        <span>{name}</span>
                                                    </Col>
                                                    <Col sm={5}>
                                                        <Image
                                                            src={url}
                                                            width="10%"
                                                        />
                                                    </Col>
                                                    <Col
                                                        sm={1}
                                                        className={"my-auto"}
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
                                                            <span>×</span>
                                                        </button>
                                                        <img
                                                            src={Reorder}
                                                            alt=""
                                                        />
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                            <ListGroup.Item as="li">
                                {uploaded ? (
                                    <Row>
                                        <Col style={{ textAlign: "center" }}>
                                            <Image src={url} width="10%" />
                                        </Col>
                                    </Row>
                                ) : (
                                    <></>
                                )}
                                <Row>
                                    <Col>
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
                                            onClose={() => setErrorShow(false)}
                                            dismissible
                                        >
                                            {errorText}
                                        </Alert>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}

export default RecipeCreatePhoto;
