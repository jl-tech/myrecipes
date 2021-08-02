import React from "react";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/esm/Button";
import SearchBar from "./search/bar";
import { Helmet } from "react-helmet-async";

function HomePage(props) {
    return (
        <>
            <Helmet>
                <title> Home - MyRecipes </title>
            </Helmet>
            <div
                style={{
                    overflow: "hidden",
                    margin: 0,
                    background: "url(http://127.0.0.1:5000/img/home_cover.jpg)",
                    backgroundSize: "cover",
                    height: "calc(100vh - 4em)",
                    width: "auto",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <Container
                    style={{
                        textAlign: "center",
                        color: "white",
                        marginTop: "10vh",
                    }}
                    className={"mx-auto container-fluid"}
                >
                    <h1 style={{ position: "center" }}>
                        Discover your next treat.
                    </h1>
                    <p className="lead">
                        Explore thousands of recipes or create your own.
                    </p>
                    <Row>
                        <Col sm={3} />
                        <Col sm={6}>
                            <SearchBar
                                loggedIn={props.loggedIn}
                                isHome={true}
                            />
                        </Col>
                    </Row>

                    <Link to="/search">
                        <Button
                            variant="danger"
                            style={{ opacity: "95%", marginTop: "1em" }}
                        >
                            Browse all
                        </Button>
                    </Link>
                    <br />
                    <br />
                    <Link style={{ color: "gray" }} to={"/legal"}>
                        {" "}
                        <small> Legal </small>{" "}
                    </Link>
                </Container>
            </div>
        </>
    );
}

export default HomePage;
