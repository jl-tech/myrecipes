import React from 'react';
import { Link } from "react-router-dom";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import ReactTimeAgo from "react-time-ago";

function RecipeViewContri(props) {
        return (
            <>
            <Row style={{marginTop:"1em"}}>
                <Col style={{textAlign:"center"}}>
                    <Image className={"shadow-lg"} src={"http://127.0.0.1:5000/img/" + props.userImgURL} alt="Profile Picture" roundedCircle height="50em" style={{align:"left"}}/>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:"center", fontSize:"140%"}}>
                    <Link to={`/profile/${props.contributorUID}`}>
                        {props.firstName} {props.lastName}
                    </Link>
                </Col>
            </Row>
            <Row style={{marginTop:"1em"}}>
                <Col style={{textAlign:"center"}}>
                    <b> Created </b>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <ReactTimeAgo date={new Date(props.createdAt)} locale="en-US"/>
                    <br/>
                    <small className={"text-muted"}>
                        {new Date(props.createdAt).toLocaleDateString('en-GB') + " " + new Date(props.createdAt).toLocaleTimeString('en-GB')}
                    </small>
                </Col>
            </Row>
            {props.editedAt != null ?
            <><Row style={{marginTop:"1em"}}>
                <Col style={{textAlign:"center"}}>
                    <b> Last modified: </b>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <ReactTimeAgo date={new Date(props.editedAt)} locale="en-US"/>
                    <br/>
                    <small className={"text-muted"}>
                        {new Date(props.editedAt).toLocaleDateString('en-GB') + " " + new Date(props.editedAt).toLocaleTimeString('en-GB')}
                    </small>
                </Col>
            </Row></> : <></>
            }
            </>
        );
}

export default RecipeViewContri;