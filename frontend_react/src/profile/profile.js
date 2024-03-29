/*
 Component providing the profile page
 */

import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";

import Col from "react-bootstrap/Col";
import ProfileEdit from "./edit/edit.js";
import ProfileRecipes from "./recipes";
import { Spinner } from "react-bootstrap";
import SubscribeButton from "../newsfeed/subscribe";
import { Helmet } from "react-helmet-async";
import ProfileListModal from "./listmodal";
import Cookie from "universal-cookie";

/**
 * Performs the API request for /profile/view and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user fetching the newsfeed
 * @param userid - the userid of the profile to view
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function profileUser(token, userid) {
    let response = await fetch(
        "http://localhost:5000/profile/view?" +
            new URLSearchParams({ user_id: userid }),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        }
    ).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function Profile(props) {
    // Whether the API request has finished being fetched
    const [fetched, setFetched] = useState(false);
    // Whether the API request was completed with a 200 return code indicating success.
    const [success, setSuccess] = useState(false);

    // The the fields in the profile page
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [recipeCount, setRecipeCount] = useState(0);
    const [subscribers, setSubscribers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [email, setEmail] = useState("");
    // The url to the profile picture
    const [imgUrl, setImgUrl] = useState("");
    // Button type that changes based on whether user logged in
    const [buttonType, setButtonType] = useState(0);
    // Whether to show the spinner
    const [showSpinner, setShowSpinner] = useState(true);

    let { id } = useParams();
    id = id == null ? props.currId : id;
    const history = useHistory();
    const cookie = new Cookie();

    /**
     * Calls and awaits for the API request function and sets the component state
     * based on the response.
     */
    async function processId() {
        let id_ = id;
        if (id_ == null) {
            id_ = props.currId;
            if (id_ == null) history.push("/");
        }

        let response = await profileUser(cookie.get("token"), id_).catch(
            (e) => {}
        );

        if (response != null) {
            setfirstName(response.FirstName);
            setlastName(response.LastName);
            setEmail(response.Email);
            setImgUrl(response.ProfilePictureURL);
            setRecipeCount(response.RecipeCount);
            setSubscribers(response.Subscribers);
            setSubscriptions(response.Subscriptions);
            setSuccess(true);
        } else {
            setShowSpinner(false);
        }
        if (props.loggedIn) {
            if (parseInt(id_) === props.currId) setButtonType(1);
            else setButtonType(2);
        }

        setFetched(true);
    }

    useEffect(() => {
        if (props.settings) {
            props.setChatbotVisible(false)
        }
        if (!fetched) processId();
    }, []);

    useEffect(() => {
        if (!props.loggedIn) setButtonType(0);
    }, [props.loggedIn]);

    if (success) {
        return (
            <>
                <Helmet>
                    <title>
                        {" "}
                        {firstName} {lastName}'s Profile - MyRecipes{" "}
                    </title>
                </Helmet>
                <Container style={{ marginTop: "1em", marginBottom: "2em" }}>
                    <Row>
                        <Col>
                            <div style={{ textAlign: "center" }}>
                                <Image
                                    src={"http://127.0.0.1:5000/img/" + imgUrl}
                                    className="shadow"
                                    alt="Profile Picture"
                                    roundedCircle
                                    height="150em"
                                    width="150em"
                                    style={{objectFit: "cover"}}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ textAlign: "center" }}>
                        <Col>
                            <h1>
                                {firstName} {lastName}
                            </h1>
                            {Number(props.currId) === Number(id) ? (
                                <div
                                    style={{
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        fontSize: "85%",
                                        backgroundColor: "tomato",
                                        color: "white",
                                        borderRadius: "5px 5px 5px 5px",
                                        height: "1.5em",
                                        width: "5em",
                                        marginBottom: "1em",
                                    }}
                                >
                                    YOU
                                </div>
                            ) : null}
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
                                            {recipeCount}{" "}
                                        </th>
                                        <th style={{ fontSize: "200%" }}>
                                            {buttonType === 1 ? (
                                                <ProfileListModal
                                                    title="Subscribers"
                                                    data={subscribers}
                                                    style={{ color: "black" }}
                                                />
                                            ) : (
                                                subscribers.length
                                            )}
                                        </th>
                                        {buttonType === 1 ? (
                                            <th style={{ fontSize: "200%" }}>
                                                <ProfileListModal
                                                    title="Subscriptions"
                                                    data={subscriptions}
                                                    style={{ color: "black" }}
                                                />
                                            </th>
                                        ) : null}
                                    </tr>
                                    <tr>
                                        <td> RECIPES</td>
                                        <td> SUBSCRIBERS</td>
                                        {buttonType === 1 ? (
                                            <td> SUBSCRIPTIONS </td>
                                        ) : null}
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div
                                style={{
                                    textAlign: "center",
                                    marginTop: "1em",
                                }}
                            >
                                {buttonType === 0 ? (
                                    <></>
                                ) : buttonType === 1 ? (
                                    <ProfileEdit
                                        setChatbotVisible={
                                            props.setChatbotVisible
                                        }
                                        firstName={firstName}
                                        setfirstName={setfirstName}
                                        lastName={lastName}
                                        setlastName={setlastName}
                                        setButtonName={props.setButtonName}
                                        email={email}
                                        imgUrl={imgUrl}
                                        setImgUrl={setImgUrl}
                                        initOpen={props.settings}
                                        modalToggle={props.modalToggle}
                                        setModalToggle={props.setModalToggle}
                                    />
                                ) : (
                                    <SubscribeButton
                                        userid={id}
                                        setSubscribers={setSubscribers}
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                    <br />
                    <ProfileRecipes
                        userID={id}
                        loggedIn={props.loggedIn}
                        loggedInUID={props.currId}
                    />
                </Container>
            </>
        );
    } else {
        if (showSpinner === true) {
            return (
                <div style={{ textAlign: "center" }}>
                    <br />
                    <Spinner style={{ color: "tomato" }} animation={"grow"} />
                </div>
            );
        } else {
            return (
                <Modal.Dialog>
                    <Modal.Body>
                        <div style={{ textAlign: "center" }}>
                            That user could not be found. <br />
                            <Link
                                to="/home"
                                component={Button}
                                style={{ marginTop: "1em" }}
                            >
                                Back to home
                            </Link>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            );
        }
    }
}

export default Profile;
