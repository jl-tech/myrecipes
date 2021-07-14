import React, { useState } from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import Button from 'react-bootstrap/esm/Button';
import InputGroup from "react-bootstrap/InputGroup";

import SearchIcon from "./search_white_24dp.svg";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import ReactTimeAgo from "react-time-ago";
import { Typeahead } from 'react-bootstrap-typeahead';


function HomePage(props) {
    const history = useHistory()
    const [searchTerm, setSearchTerm] = useState("")
    const [errorShow, setErrorShow] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault()
        if (searchTerm === "") {
            setErrorShow(true)
        } else {
            history.push(`/search?query=${searchTerm}`)
        }

    }
    async function handleOnKeyDown(e) {
        if (e.key === 'Enter') {
            handleSubmit(e)
        }
    }
    function toggleSuggestions() {
        setShowSuggestions(false);
        setShowSuggestions(true);
    }

    return (
        <>
            <body style={{overflow: 'hidden', margin: 0, background: "url(http://127.0.0.1:5000/img/home_cover.jpg)", backgroundSize: "cover",  height: "92.5vh", width: "auto", backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
            <Container style={{textAlign: 'center', color: 'white', marginTop: "10vh"}} className={"mx-auto container-fluid"}>
                <h1 style={{position: 'center'}}>Discover your next treat.</h1>
                <p className="lead">Explore thousands of recipes or create your own.</p>
                <Form onSubmit={handleSubmit}>
                    <Form.Row>
                    <Col sm={3} />
                    <Col sm={6}>
                    <InputGroup>
                        {/* <Form.Control size="lg" type="text" placeholder="Search Recipes"
                                    style={{background: 'white', opacity:"95%", textAlign: "center"}}
                                    required onChange={e => setSearchTerm(e.target.value)}
                                    onKeyDown={handleOnKeyDown}  />
                        <InputGroup.Append><DropdownButton style={{height:"100%"}}>
                            <Dropdown.Menu style={{width:"100%"}}  >
                                <Dropdown.Item>Apple</Dropdown.Item>
                                <Dropdown.Item>Chicken</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item>Clear All</Dropdown.Item>
                            </Dropdown.Menu>
                        </DropdownButton></InputGroup.Append> */}
                        <Typeahead placeholder='Search Recipes' options={['apple', 'pear']} style={{width:"90%"}} emptyLabel="No related history"/>
                        <InputGroup.Append>
                            <Button type="submit" variant="primary" style={{opacity: "95%"}}>
                                <img src={SearchIcon} />
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                    {/* <Alert show={errorShow} variant="danger" style={{marginTop:'1em'}} onClose={() => setErrorShow(false)} dismissible>
                        Please enter a search term.
                    </Alert> */}
                    </Col>
                    </Form.Row>
                </Form>
                <Button variant="danger" style={{opacity: "95%", marginTop:"1em"}}>
                    Browse all
                </Button>

            </Container>

            </body>



        </>
    );
}

export default HomePage;