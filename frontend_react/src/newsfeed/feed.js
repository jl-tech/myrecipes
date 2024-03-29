/**
 * Component providing the newsfeed page
 */

import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Cookie from "universal-cookie";
import Pagination from "react-bootstrap/Pagination";
import ListGroup from "react-bootstrap/ListGroup";
import ReactTimeAgo from "react-time-ago";

import { Helmet } from "react-helmet-async";
import Like from "../images/Like.svg";
import Comment from "../images/comment_black_24dp.svg";
import Button from "react-bootstrap/Button";

/**
 * Performs the API request for /newsfeed/get_feed and returns the result of that
 * request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user fetching the newsfeed
 * @param page - the page number
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestFeed(token, page) {
    let response = await fetch(
        "http://localhost:5000/newsfeed/get_feed?" +
            new URLSearchParams({ page: page }),
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

/**
 * Performs the API request for /newsfeed/get_subscriptions and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user fetching the newsfeed
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function profileUser(token) {
    let response = await fetch(
        "http://localhost:5000/newsfeed/get_subscriptions",
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

function Feed() {
    // Whether the feed API request has finished being fetched
    const [fetchedFeed, setFetchedFeed] = useState(false);
    // Whether the profile API request has finished being fetched
    const [fetchedProfile, setFetchedProfile] = useState(false);

    // The state of the various user-related fields
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [recipeCount, setRecipeCount] = useState(0);
    const [subscribers, setSubscribers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [imgUrl, setImgUrl] = useState(""); // the profile picture

    // The list of recipes
    const [recipes, setRecipes] = useState(null);
    // The number of pages
    const [pages, setPages] = useState(null);

    // State to handle shadow effect on hover
    const [hoveredRecipeId, setHoveredRecipeId] = useState(-1);
    const [activePage, setActivePage] = useState(null);
    const [hoveredProfile, setHoveredProfile] = useState(false);

    // Whether the RECOMMENDED tag is being hovered
    const [recommendedTagHovered, setRecommendedTagHovered] = useState(false);

    let { page } = useParams();
    const cookie = new Cookie();
    const history = useHistory();
    const [hideRecommended, setHideRecommended] = useState(
        cookie.get("recommended_hidden") === "true"
    );
    console.log(hideRecommended);

    /**
     * Calls and awaits for the API request function to get the newsfeed
     * Sets the state of variables based on the response.
     */
    async function getFeed() {
        let page_ = /^\d+$/.test(page) ? page : 1;
        let response = await requestFeed(cookie.get("token"), page_).catch(
            (e) => {}
        );

        if (response != null) {
            setRecipes(response.feed);
            setPages(response.count);
            setActivePage(parseInt(page_));
        }

        setFetchedFeed(true);
    }

    /**
     * Calls and awaits for the API request function to get the user details
     * Sets the state of variables based on the response.
     */
    async function getProfile() {
        let response = await profileUser(cookie.get("token")).catch((e) => {});

        if (response != null) {
            setfirstName(response.FirstName);
            setlastName(response.LastName);
            setImgUrl(response.ProfilePictureURL);
            setRecipeCount(response.RecipeCount);
            setSubscribers(response.Subscribers);
            setSubscriptions(response.Subscriptions);
        }

        setFetchedProfile(true);
    }

    useEffect(() => {
        if (!fetchedFeed) getFeed();
        if (!fetchedProfile) getProfile();
    }, []);

    /**
     * Handles the clicking of the recommended tag by hiding recommended
     */
    function handleClickTag(e) {
        e.stopPropagation();
        doHideRecommended();
    }

    /**
     * Hides recommended and saves this setting in cookie
     */
    function doHideRecommended() {
        cookie.set("recommended_hidden", "true", {
            path: "/newsfeed",
            sameSite: "strict",
        });
        setHideRecommended(true);
        console.log(cookie.get("recommended_hidden"));
    }

    /**
     * Shows recommended and saves this setting in cookie
     */
    function doShowRecommended() {
        cookie.set("recommended_hidden", "false", {
            path: "/newsfeed",
            sameSite: "strict",
        });
        setHideRecommended(false);
        console.log(cookie.get("recommended_hidden"));
    }

    /**
     * Generates each recipe card. Should be used in a map.
     * @param recipe - the details of the recipe as a dict
     * @param index - the index of the card
     * @return the card as a react fragment
     */
    function generateCard(recipe, index) {
        if (hideRecommended && recipe.recommended) {
            return null;
        } else {
            return (
                <div style={{ padding: "1em", width: "100%" }} key={index}>
                    <Card
                        onMouseEnter={() =>
                            setHoveredRecipeId(recipe.recipe_id)
                        }
                        onMouseLeave={() => setHoveredRecipeId(-1)}
                        className={
                            hoveredRecipeId === recipe.recipe_id
                                ? "shadow-lg"
                                : "shadow-sm"
                        }
                    >
                        <div
                            style={{
                                color: "black",
                                textDecoration: "none",
                                cursor: "pointer",
                            }}
                            role="link"
                            onClick={() =>
                                history.push("/recipe/" + recipe.recipe_id)
                            }
                        >
                            <Card.Header className={"text-truncate"}>
                                <Row>
                                    <Col sm={1} className={"mx-auto my-auto"}>
                                        <Link to={"/profile/" + recipe.user_id}>
                                            <Image
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                src={
                                                    "http://127.0.0.1:5000/img/" +
                                                    recipe.profile_pic_path
                                                }
                                                alt="Profile Picture"
                                                roundedCircle
                                                width="40em"
                                                height="40em"
                                                style={{objectFit:"cover"}}
                                            />
                                        </Link>
                                    </Col>
                                    <Col sm={8}>
                                        <Link to={"/profile/" + recipe.user_id}>
                                            <div
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                {recipe.first_name +
                                                    " " +
                                                    recipe.last_name}
                                                <br />
                                            </div>
                                        </Link>

                                        {"Created "}
                                        <ReactTimeAgo
                                            date={
                                                new Date(recipe.creation_time)
                                            }
                                            locale="en-US"
                                        />
                                        {recipe.edit_time != null ? (
                                            <>
                                                {" | Modified "}
                                                <ReactTimeAgo
                                                    date={
                                                        new Date(
                                                            recipe.edit_time
                                                        )
                                                    }
                                                    locale="en-US"
                                                />{" "}
                                            </>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                    {recipe.recommended ? (
                                        <Col
                                            sm={3}
                                            style={{
                                                color: "grey",
                                                textAlign: "center",
                                            }}
                                            className={"align-content-end"}
                                        >
                                            <div
                                                style={{
                                                    marginLeft: "2em",
                                                    fontSize: "85%",
                                                    backgroundColor:
                                                        recommendedTagHovered
                                                            ? "#ff751a"
                                                            : "tomato",
                                                    color: "white",
                                                    borderRadius:
                                                        "5px 5px 5px 5px",
                                                    height: "1.5em",
                                                    width: "10em",
                                                }}
                                                onMouseEnter={() =>
                                                    setRecommendedTagHovered(
                                                        true
                                                    )
                                                }
                                                onMouseLeave={() =>
                                                    setRecommendedTagHovered(
                                                        false
                                                    )
                                                }
                                                onClick={
                                                    recommendedTagHovered
                                                        ? (e) =>
                                                              handleClickTag(e)
                                                        : null
                                                }
                                            >
                                                {recommendedTagHovered
                                                    ? "Hide Recommended"
                                                    : "RECOMMENDED"}
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col sm={3} />
                                    )}
                                </Row>
                            </Card.Header>
                            <Card.Img
                                variant="Top"
                                style={{
                                    width: "100%",
                                    height: "9vw",
                                    objectFit: "cover",
                                }}
                                alt="Recipe Image"
                                src={
                                    recipe.photo_path == null
                                        ? "http://127.0.0.1:5000/img/default_recipe.png"
                                        : "http://127.0.0.1:5000/img/" +
                                          recipe.photo_path
                                }
                            />
                            <Card.Body style={{ textAlign: "center" }}>
                                <Card.Title className={"text-truncate"}>
                                    {recipe.name}
                                </Card.Title>
                                <Card.Text
                                    className="text-truncate"
                                    style={{
                                        height: "1.5em",
                                        textDecoration: "none",
                                    }}
                                >
                                    {recipe.description == null
                                        ? "No description available"
                                        : recipe.description}
                                </Card.Text>
                                <Card.Text></Card.Text>
                                <Row>
                                    <Col sm={3} />
                                    <Col sm={6} style={{ textAlign: "center" }}>
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
                                                    <th
                                                        style={{
                                                            fontSize: "95%",
                                                        }}
                                                    >
                                                        {" "}
                                                        {
                                                            recipe.time_to_cook
                                                        }{" "}
                                                    </th>
                                                    <th
                                                        style={{
                                                            fontSize: "95%",
                                                        }}
                                                    >
                                                        {" "}
                                                        {
                                                            recipe.serving_size
                                                        }{" "}
                                                    </th>
                                                    <th
                                                        style={{
                                                            fontSize: "95%",
                                                        }}
                                                    >
                                                        {" "}
                                                        {recipe.type}{" "}
                                                    </th>
                                                    <th
                                                        style={{
                                                            fontSize: "95%",
                                                        }}
                                                    >
                                                        {" "}
                                                        {recipe.calories == null
                                                            ? "N/A"
                                                            : recipe.calories}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style={{
                                                            fontSize: "80%",
                                                        }}
                                                    >
                                                        {" "}
                                                        MINS
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontSize: "80%",
                                                        }}
                                                    >
                                                        {" "}
                                                        SERVES
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontSize: "80%",
                                                        }}
                                                    >
                                                        {" "}
                                                        MEAL
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontSize: "80%",
                                                        }}
                                                    >
                                                        {" "}
                                                        CAL
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Col>
                                    <Col sm={3} style={{ textAlign: "right" }}>
                                        <Image
                                            src={Like}
                                            style={{ height: "35%" }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "125%",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            {" "}
                                            {recipe.likes}{" "}
                                        </span>
                                        <Image
                                            src={Comment}
                                            style={{ height: "40%" }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "125%",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            {" "}
                                            {recipe.comments}{" "}
                                        </span>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </div>
                    </Card>
                </div>
            );
        }
    }

    /**
     * Changes the active page
     * @param page_ the page to change to
     */
    function navigatePage(page_) {
        history.push("/newsfeed/" + page_);
        history.go();
    }

    return (
        <>
            <Helmet>
                <title> Newsfeed - MyRecipes </title>
            </Helmet>
            <Container style={{ marginTop: "1em", marginBottom: "2em" }}>
                <Row>
                    <Col sm={3}>
                        {!fetchedProfile ? (
                            <div style={{ textAlign: "center" }}>
                                <br />
                                <Spinner
                                    style={{ color: "tomato" }}
                                    animation={"grow"}
                                />
                            </div>
                        ) : (
                            <>
                                <Row>
                                    <Col>
                                        <div
                                            style={{ cursor: "pointer" }}
                                            role="link"
                                            onClick={() =>
                                                history.push("/profile")
                                            }
                                        >
                                            <Modal.Dialog
                                                onMouseEnter={() =>
                                                    setHoveredProfile(true)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredProfile(false)
                                                }
                                                className={
                                                    hoveredProfile
                                                        ? "shadow-lg"
                                                        : "shadow-sm"
                                                }
                                            >
                                                <Modal.Header
                                                    style={{
                                                        paddingTop: "0.5em",
                                                        paddingBottom: "0.5em",
                                                    }}
                                                >
                                                    <Col
                                                        style={{
                                                            textAlign: "center",
                                                            fontSize: "125%",
                                                        }}
                                                    >
                                                        {" "}
                                                        Your Profile{" "}
                                                    </Col>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Row>
                                                        <Col
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Image
                                                                src={
                                                                    "http://127.0.0.1:5000/img/" +
                                                                    imgUrl
                                                                }
                                                                alt="Profile Picture"
                                                                roundedCircle
                                                                width="70em"
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <h4>
                                                                {firstName}{" "}
                                                                {lastName}
                                                            </h4>
                                                        </Col>
                                                    </Row>
                                                    <Row
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <Col>
                                                            <table
                                                                style={{
                                                                    marginLeft:
                                                                        "auto",
                                                                    marginRight:
                                                                        "auto",
                                                                    borderCollapse:
                                                                        "separate",
                                                                    borderSpacing:
                                                                        "1em 0em",
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <th
                                                                            style={{
                                                                                fontSize:
                                                                                    "150%",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            {
                                                                                recipeCount
                                                                            }{" "}
                                                                        </th>
                                                                        <th
                                                                            style={{
                                                                                fontSize:
                                                                                    "150%",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            {
                                                                                subscribers.length
                                                                            }{" "}
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            {" "}
                                                                            RECIPES
                                                                        </td>
                                                                        <td>
                                                                            {" "}
                                                                            SUBSCRIBERS
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </Col>
                                                    </Row>
                                                </Modal.Body>
                                            </Modal.Dialog>
                                        </div>
                                    </Col>
                                </Row>
                                <Row
                                    className={"mx-auto align-content-center"}
                                    style={{ textAlign: "center" }}
                                >
                                    <Col>
                                        <Button
                                            onClick={
                                                hideRecommended
                                                    ? () => doShowRecommended()
                                                    : () => doHideRecommended()
                                            }
                                        >
                                            {" "}
                                            {hideRecommended
                                                ? "Show Recommended"
                                                : "Hide Recommended"}{" "}
                                        </Button>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        {subscriptions.length === 0 ? null : (
                                            <ListGroup>
                                                <ListGroup.Item variant="primary">
                                                    Subscriptions
                                                </ListGroup.Item>
                                                {subscriptions.map(
                                                    (
                                                        {
                                                            first_name,
                                                            last_name,
                                                            user_id,
                                                            profile_pic_path,
                                                        },
                                                        index
                                                    ) => (
                                                        <ListGroup.Item
                                                            key={index}
                                                        >
                                                            <Link
                                                                to={
                                                                    "/profile/" +
                                                                    user_id
                                                                }
                                                                style={{
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <Row>
                                                                    <Col sm={3}>
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
                                                                        {
                                                                            first_name
                                                                        }{" "}
                                                                        {
                                                                            last_name
                                                                        }
                                                                    </Col>
                                                                </Row>
                                                            </Link>
                                                        </ListGroup.Item>
                                                    )
                                                )}
                                            </ListGroup>
                                        )}
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Col>
                    <Col sm={9}>
                        {!fetchedFeed ? (
                            <div style={{ textAlign: "center" }}>
                                <br />
                                <Spinner
                                    style={{ color: "tomato" }}
                                    animation={"grow"}
                                />
                            </div>
                        ) : (
                            <>
                                <Row>
                                    <Col>
                                        {subscriptions.length === 0 ? (
                                            <Modal.Dialog
                                                style={{ textAlign: "center" }}
                                            >
                                                <Modal.Title
                                                    style={{ padding: "1em" }}
                                                >
                                                    {" "}
                                                    You haven't subscribed to
                                                    anyone.{" "}
                                                </Modal.Title>
                                                <Modal.Body>
                                                    Visit a profile and select
                                                    Subscribe, and your newsfeed
                                                    will show their most recent
                                                    recipes.{" "}
                                                </Modal.Body>
                                            </Modal.Dialog>
                                        ) : recipes.length === 0 ? (
                                            <Modal.Dialog>
                                                <Modal.Body>
                                                    Your subscriptions have not
                                                    created recipes.
                                                </Modal.Body>
                                            </Modal.Dialog>
                                        ) : (
                                            recipes.map(generateCard)
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Pagination style={{ padding: "1em" }}>
                                            {[...Array(pages).keys()].map(
                                                (i) => (
                                                    <Pagination.Item
                                                        key={i}
                                                        active={
                                                            i + 1 === activePage
                                                        }
                                                        onClick={() =>
                                                            navigatePage(i + 1)
                                                        }
                                                    >
                                                        {i + 1}
                                                    </Pagination.Item>
                                                )
                                            )}
                                        </Pagination>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Feed;
