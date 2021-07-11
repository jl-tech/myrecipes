import React, { useState } from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Cookie from 'universal-cookie';
import Button from 'react-bootstrap/esm/Button';
import Image from "react-bootstrap/Image";


function HomePage(props) {
    const history = useHistory()
    const [searchTerm, setSearchTerm] = useState("")
    const [errorShow, setErrorShow] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        if (searchTerm === "") {
            setErrorShow(true)
        } else {
            history.push(`/search?query=${searchTerm}`)
        }

    }

    return (
        <>
            <body  style={{overflow: 'hidden', background: "url(http://127.0.0.1:5000/img/home_cover.jpg)", backgroundSize: "cover",  height: "92.5vh", backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
            <Container style={{textAlign: 'center', color: 'white', marginTop: "10vh"}} className={"mx-auto container-fluid"}>
                <h1 style={{position: 'center'}}>Discover your next treat.</h1>
                <p className="lead">Explore thousands of recipes or create your own.</p>
                <Row className={"justify-content-center"}>
                    <Alert show={errorShow} variant="warning" onClose={() => setErrorShow(false)} dismissible>
                        Please enter a search term.
                    </Alert>
                    <Form.Control size="lg" type="text" placeholder="🔎︎ Search Recipes"
                                  style={{background: 'white', opacity:"80%", textAlign: "center", textColor:"black"}}
                                  required onChange={e => setSearchTerm(e.target.value)}/>

                    <Button onClick={handleSubmit} type="button" style={{marginTop: '1vh', opacity: "80%"}}> Search </Button>

                </Row>
                <Row className={"justify-content-center"}>
                    <Link to={"/recipe/create"}>
                        <Button style={{marginTop: '5vh', opacity: "80%"}}> Create my own recipe </Button>
                    </Link>
                </Row>
                <Row className={"justify-content-center"}>
                    <Link to={"/newsfeed"}>
                        <Button style={{marginTop: '1vh', opacity: "80%"}}> Go to newsfeed </Button>
                    </Link>
                </Row>

            </Container>

            </body>



        </>
    );
}

export default HomePage;