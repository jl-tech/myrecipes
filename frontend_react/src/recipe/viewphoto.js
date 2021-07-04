import React, {useEffect, useState} from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from "react-bootstrap/Carousel";



function RecipeViewPhoto(props) {

    return (
        <>
            <Row>
                <Col>
                    <Carousel >
                    {props.photos.map((url, index) =>
                        <Carousel.Item style={{textAlign:"center", backgroundColor:"gray"}}>
                            <img src={"http://127.0.0.1:5000/img/" + url} className=""alt={`Photo ${index}`} style={{height:"20em"}}/>
                        </Carousel.Item>
                    )}
                    </Carousel>
                </Col>
            </Row>
        </>
    );
}

export default RecipeViewPhoto;