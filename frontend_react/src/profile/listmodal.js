/**
 * Component providing the user list on click
 */

import React, { useState } from "react";

import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { Link, useHistory } from "react-router-dom";

import Image from "react-bootstrap/Image";

/**
 * Component providing the user count and user list on click
 */
function ProfileListModal(props) {
    const history = useHistory();
    // Whether the modal containing the user list is shown
    const [showModal, setShowModal] = useState(false);

    function modalShow(e) {
        e.preventDefault();
        setShowModal(true);
    }

    const modalHide = () => setShowModal(false);
    return (
        <>
            <a href="#" style={props.style} onClick={(e) => modalShow(e)}>
                {" "}
                {props.data.length}{" "}
            </a>
            <Modal show={showModal} onHide={modalHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {props.data.map(
                            (
                                {
                                    first_name,
                                    last_name,
                                    user_id,
                                    profile_pic_path,
                                },
                                index
                            ) => (
                                <ListGroup.Item key={index}>
                                    <Link
                                        to={"/profile/" + user_id}
                                        style={{ width: "100%" }}
                                        onClick={() => {
                                            history.push("/profile/" + user_id);
                                            history.go(0);
                                        }}
                                    >
                                        <Row>
                                            <Col sm={2}>
                                                <Image
                                                    src={
                                                        "http://127.0.0.1:5000/img/" +
                                                        profile_pic_path
                                                    }
                                                    alt="Profile Picture"
                                                    roundedCircle
                                                    width="40em"
                                                />
                                            </Col>
                                            <Col>
                                                {first_name} {last_name}
                                            </Col>
                                        </Row>
                                    </Link>
                                </ListGroup.Item>
                            )
                        )}
                    </ListGroup>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ProfileListModal;
