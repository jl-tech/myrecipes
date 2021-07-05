import React, {useEffect, useState} from 'react';
import imageCompression from 'browser-image-compression';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from "react-bootstrap/Carousel";
import Cookie from 'universal-cookie';

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Image from 'react-bootstrap/Image';

import ListGroup from 'react-bootstrap/ListGroup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Reorder from './reorder_black_24dp.svg';

async function requestEditPhotos(token, recipe_id, photos, names) {
    let data = new FormData()
    data.append('recipe_id', recipe_id)
    photos.forEach(photo => data.append('photos[]', photo))
    data.append('photo_names', names)

    let response = await fetch('http://localhost:5000/recipe/editphotos', {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: data
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();
    
    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

export function EditPhoto(props) {
    const editClose = () => {
        props.setShowPhotoEdit(false);
        setUrl('');
        setUploaded(false);
        setImage(null);
    }
    const [errorShow, setErrorShow] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [errorShow2, setErrorShow2] = useState(false);
    const [errorText2, setErrorText2] = useState('');
    const [successShow, setSuccessShow] = useState(false);

    const [uploaded, setUploaded] = useState(false);
    const [url, setUrl] = useState('');
    const [image, setImage] = useState(null);
    const cookie = new Cookie();

    function makeJson() {
        let photosP = [];
        let idCountP = 0;
        for (let photo of props.photos) {
            photosP.push({
                id: idCountP.toString(),
                url: photo['url'],
                image: photo['image'],
                name: photo['name']
            });
            idCountP++;
        }
        return photosP;
    }

    const [photos, setPhotos] = useState(makeJson());
    const [idCount, setIdCount] = useState(photos.length);

    function handleOnDragEnd(e) {
        if (e.destination == null) return;
        const items = Array.from(photos);
        const [selected] = items.splice(e.source.index, 1);
        items.splice(e.destination.index, 0, selected);
        setPhotos(items);
    }

    function addRow() {
        if (!uploaded) {
            setErrorShow(true);
            setErrorText('Please upload valid image');
            return;
        }
        let items = Array.from(photos);
        items.push({
            id: idCount.toString(),
            url: url,
            image: image,
            name: image.name
        });
        setIdCount(idCount + 1);
        setPhotos(items);
        setImage(null);
        setUrl('');
        setUploaded(false);
        document.getElementById("file-upload").value = "";
    }

    function removePhoto(index) {
        let items = Array.from(photos);
        items.splice(index, 1);
        setPhotos(items);
    }

    async function handleImageUpload(event) {
        const imageFile = event.target.files[0];
        const options = {
            maxSizeMB: 0.5
        }
        if (!imageFile.type.startsWith('image/')) {
            setErrorShow(true);
            setErrorText('File is not image type');
            setImage(null);
            setUrl('');
            setUploaded(false);
            return;
        }
        await imageCompression(imageFile, options).then(compressedFile => {
            setImage(compressedFile);
            setUrl(URL.createObjectURL(compressedFile));
            setErrorShow(false);
            setUploaded(true);
        }).catch(e => {
            console.log(e);
            setImage(null);
            setUrl('');
            setUploaded(false);
            setErrorShow(false);
        });   
    }

    async function handleSubmit() {
        let images = []
        let names = []
        console.log("debug")
        photos.forEach(photo => {
            images.push(photo.image)
            names.push(photo.name)
        });

        let response = await requestEditPhotos(cookie.get('token'), props.recipeId, images, JSON.stringify(names))
            .catch(e => {
                setErrorShow2(true);
                setSuccessShow(false);
                setErrorText(e.message);
            });

        if (response != null) {
            setErrorShow2(false);
            let photosP = [];
            for (let photo of photos) {
                photosP.push({
                    url: photo.url,
                    image: photo.image,
                    name: photo.name
                });
            }
            console.log(photosP);
            props.setPhotos(photosP);
            setSuccessShow(true);
        }
    }

    return (
        <Modal show={props.showPhotoEdit} onHide={editClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Photos
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="photos">
                    {(provided) => (
                        <ListGroup as="ul" {...provided.droppableProps} ref={provided.innerRef} style={{marginBottom:"1em"}}>
                            {photos.map(({id, url, image, name}, index) => {
                                return (
                                    <Draggable key={id} draggableId={id} index={index}>
                                        {(provided) => (
                                            <ListGroup.Item as="li" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                                <Row >
                                                    <Col sm={2}>
                                                        {index == 0 ? "1 (Main)" : index+1}
                                                    </Col>
                                                    <Col sm={4}>
                                                        <span>{name}</span>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Image src={url} height="100em"/>
                                                    </Col>
                                                    <Col sm={2}>
                                                        <button type="button" className="close" onClick={() => removePhoto(index)}>
                                                            <span>×</span>
                                                        </button>
                                                        <img src={Reorder} />
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                            <ListGroup.Item as="li">
                                {uploaded ?
                                <Row>
                                    <Col style={{textAlign:"center"}}>
                                        <Image src={url} width="10%"/>
                                    </Col>
                                </Row>
                                :<></>}
                                <Row>
                                    <Col sm={11}>
                                        <Form.File onChange={e => handleImageUpload(e)} id="file-upload"/>

                                        <Alert show={errorShow} variant="danger" style={{marginTop:"1em"}} onClose={() => setErrorShow(false)} dismissible>
                                            {errorText}
                                        </Alert>
                                    </Col>
                                    <Col sm={1}>
                                        <Button variant="outline-secondary" style={{float:"right"}} onClick={addRow}>Add</Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    )}
                </Droppable>
            </DragDropContext>
            <Alert show={errorShow2} variant="danger" onClose={() => setErrorShow2(false)} dismissible>
                {errorText2}
            </Alert>
            <Alert show={successShow} variant="success" onClose={() => setSuccessShow(false)} dismissible>
                Successfully updated recipe details
            </Alert>
            <div style={{textAlign:"center"}}>
                <Button type="submit" size="sm" onClick={handleSubmit}>
                    Confirm
                </Button>
            </div>
            </Modal.Body>
        </Modal>
    );
}

function RecipeViewPhoto(props) {

    return (
        <>
            <Row style={{marginBottom:"1em"}}>
                <Col>
                    <Carousel >
                    {props.photos.map(({url}, index) =>
                        <Carousel.Item key={index} style={{textAlign:"center", backgroundColor:"gray"}}>
                            <img src={url} className=""alt={`Photo ${index}`} style={{height:"20em"}}/>
                        </Carousel.Item>
                    )}
                    </Carousel>
                </Col>
            </Row>
        </>
    );
}

export default RecipeViewPhoto;