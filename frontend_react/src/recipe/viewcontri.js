/**
 * Component providing the contributor section of the recipe page, which includes
 * the contributor details and the creation/edit time.
 */

import React, {useState} from 'react';
import {useHistory} from "react-router-dom";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import ReactTimeAgo from "react-time-ago";
import Modal from "react-bootstrap/Modal";

function RecipeViewContri(props) {
    // Whether user is hovering over the profile, to support shadow effect
    // on hover.
    const [hoveredProfile, setHoveredProfile] = useState(false)
    const history = useHistory()
    return (
        <>
            <Row>
                <Modal.Dialog
                    onMouseEnter={() => setHoveredProfile(true)}
                    onMouseLeave={() => setHoveredProfile(false)}
                    className={hoveredProfile ? 'shadow-lg' : 'shadow-sm'}
                    onClick={() => history.push('/profile/' + props.contributorUID)}
                    style={{cursor: "pointer"}}
                >
                    <Modal.Header
                        style={{paddingTop: "0.5em", paddingBottom: "0.5em"}}>
                        <Col style={{
                            textAlign: "center",
                            fontSize: "125%"
                        }}> Contributor </Col>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col
                                style={{textAlign: "center", fontSize: "125%"}}>
                                <Image className={"shadow-lg"}
                                       src={"http://127.0.0.1:5000/img/" + props.userImgURL}
                                       alt="Profile Picture" roundedCircle
                                       height="55em" style={{align: "left"}}/>
                                <br/>
                                {props.firstName} {props.lastName}
                            </Col>
                        </Row>
                        <Row style={{textAlign: "center"}}>
                            <table style={{
                                marginTop: "1em",
                                marginLeft: "auto",
                                marginRight: "auto",
                                borderCollapse: "separate",
                                borderSpacing: "1em 0em"
                            }}>
                                <tbody>
                                <b>{props.contributorRecipes} </b> Recipes <br/>
                                <b> {props.contributorSubscribers} </b> Subscribers
                                </tbody>
                            </table>
                        </Row>
                    </Modal.Body>
                </Modal.Dialog>
            </Row>
            <Row style={{marginTop: "1em"}}>
                <Col style={{textAlign: "center"}}>
                    <b> Created </b>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign: "center"}}>
                    <ReactTimeAgo date={new Date(props.createdAt)}
                                  locale="en-US"/>
                    <br/>
                    <small className={"text-muted"}>
                        {new Date(props.createdAt).toLocaleDateString('en-GB') + " " +
                        new Date(props.createdAt).toLocaleTimeString('en-GB')}
                    </small>
                </Col>
            </Row>
            {props.editedAt != null ?
                <><Row style={{marginTop: "1em"}}>
                    <Col style={{textAlign: "center"}}>
                        <b> Last modified: </b>
                    </Col>
                </Row>
                    <Row>
                        <Col style={{textAlign: "center"}}>
                            <ReactTimeAgo date={new Date(props.editedAt)}
                                          locale="en-US"/>
                            <br/>
                            <small className={"text-muted"}>
                                {new Date(props.editedAt).toLocaleDateString('en-GB') + " " +
                                new Date(props.editedAt).toLocaleTimeString('en-GB')}
                            </small>
                        </Col>
                    </Row></> : <></>
            }
        </>
    );
}

export default RecipeViewContri;