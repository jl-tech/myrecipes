/**
 * Component handling the list of user profiles in Find User functionality
 */

import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import { CardDeck } from "react-bootstrap";
import SearchIconSmall from "../images/search_white_18dp.svg";
import SearchIconBig from "../images/search_white_24dp.svg";
import InputGroup from "react-bootstrap/InputGroup";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

/**
 * Performs the API request for /profile/finduser and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param input - the input for find user
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestUsers(input) {
    let response = await fetch("http://localhost:5000/profile/finduser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            input: input,
        }),
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function ProfileList(props) {
    // Current value of the input field
    const [input, setInput] = useState("");
    // The list of user data resulting from the search
    const [userData, setUserData] = useState([]);
    // To support shadow effect on hover
    const [userIndexHovered, setUserIndexHovered] = useState(-1);
    // Whether to show the error box
    const [errorShow, setErrorShow] = useState(false);
    // The text to show in error box
    const [errorText, setErrorText] = useState("");
    // Shadow effect on hover for search bar
    const [searchHover, setSearchHovered] = useState(false);
    // Whether search operation completed
    const [searched, setSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        setSearchHovered(false);
        setIsLoading(true);
        let response = await requestUsers(input).catch((e) => {
            setErrorShow(true);
            setErrorText(e.message);
        });

        if (response != null) {
            setUserData(response);
            setIsLoading(false);
            setSearched(true);
        }
    }

    if (isLoading)
        return (
            <>
                <Helmet>
                    <title> Find Users </title>
                </Helmet>
                <div style={{ textAlign: "center", width: "100%" }}>
                    <br />
                    <Spinner animation={"grow"} style={{ color: "tomato" }} />
                </div>
            </>
        );
    else
        return (
            <>
                <Helmet>
                    <title> Find Users </title>
                </Helmet>
                <Container style={{ marginTop: "1em", marginBottom: "2em" }}>
                    <Row>
                        <Col>
                            <div style={{ textAlign: "center" }}>
                                <h2>Find Users</h2>
                                <br />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={"mx-auto align-content-center"}>
                            <Form
                                className={
                                    searchHover ? "shadow-lg" : "shadow-sm"
                                }
                                onSubmit={handleSubmit}
                                style={{
                                    width: "45%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                                onMouseEnter={() => setSearchHovered(true)}
                                onMouseLeave={() => setSearchHovered(false)}
                            >
                                <InputGroup>
                                    <Form.Control
                                        placeholder={"Search users by name"}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        defaultValue={searched ? input : null}
                                        required
                                    />
                                    <InputGroup.Append>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            variant="primary"
                                            disabled={props.disabled}
                                        >
                                            <img
                                                src={
                                                    props.nav
                                                        ? SearchIconSmall
                                                        : SearchIconBig
                                                }
                                                alt=""
                                            />
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        {userData.length === 0 ? (
                            searched ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        width: "100%",
                                    }}
                                >
                                    <br />
                                    <h4> No users found </h4>
                                </div>
                            ) : null
                        ) : (
                            <CardDeck
                                className={"align-content-center mx-auto"}
                                style={{ marginTop: "2em" }}
                            >
                                {userData.map(
                                    (
                                        {
                                            first_name,
                                            last_name,
                                            user_id,
                                            profile_pic_path,
                                        },
                                        index
                                    ) => (
                                        <Card
                                            key={index}
                                            onMouseEnter={() =>
                                                setUserIndexHovered(index)
                                            }
                                            onMouseLeave={() =>
                                                setUserIndexHovered(-1)
                                            }
                                            className={
                                                userIndexHovered === index
                                                    ? "shadow-lg"
                                                    : "shadow-sm"
                                            }
                                            role={"link"}
                                            onClick={() =>
                                                history.push(
                                                    "/profile/" + user_id
                                                )
                                            }
                                            style={{
                                                marginBottom: "1em",
                                                cursor: "pointer",
                                                width: "15em",
                                            }}
                                        >
                                            <Image
                                                src={
                                                    profile_pic_path == null
                                                        ? "http://127.0.0.1:5000/img/default_recipe.png"
                                                        : "http://127.0.0.1:5000/img/" +
                                                          profile_pic_path
                                                }
                                                alt="Profile Picture"
                                                roundedCircle
                                                style={{
                                                    marginTop: "1em",
                                                    marginLeft: "auto",
                                                    marginRight: "auto",
                                                    objectFit: "cover",
                                                    height: "8em",
                                                    width: "8em",
                                                }}

                                            />
                                            <Card.Body>
                                                <h5
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {" "}
                                                    {first_name} {last_name}{" "}
                                                </h5>
                                            </Card.Body>
                                        </Card>
                                    )
                                )}
                            </CardDeck>
                        )}
                    </Row>
                </Container>
            </>
        );
}

export default ProfileList;
