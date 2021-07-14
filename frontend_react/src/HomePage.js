import React, {useEffect, useState} from 'react';
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
import {Typeahead, Highlighter, Menu} from 'react-bootstrap-typeahead';
import Cookie from 'universal-cookie';
import MenuItem from "react-bootstrap-typeahead/lib/components/MenuItem";

async function getHistory(token) {
    let response = await fetch('http://localhost:5000/search/history', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function HomePage(props) {
    const history = useHistory()
    const [searchTerm, setSearchTerm] = useState("")
    const [errorShow, setErrorShow] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchHistoryTerms, setSearchHistoryTerms] = useState([]);
    const [searchHistoryTimes, setSearchHistoryTimes] = useState([])
    const [historyFetched, setHistoryFetched] = useState(false)

    const cookie = new Cookie();

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

    async function processHistory() {
        let response = await getHistory(cookie.get('token'))
            .catch(e => {

            });

        if (response != null) {
            // setSearchHistoryTerms(response.map(item => {return item.search_term}))
            // setSearchHistoryTimes(response.map(item => {return item.time}))
            setSearchHistoryTerms(response)
        }

        setHistoryFetched(true);
    }

    function handleRemoveHistory(elementToRemove) {
        let temp = searchHistoryTerms
        temp.splice(searchHistoryTerms.indexOf(elementToRemove),1)
        setSearchHistoryTerms(temp)
    }

    useEffect(() => {
        if (!historyFetched) processHistory();
    }, []);


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
                        <Typeahead placeholder='Search Recipes' options={searchHistoryTerms}
                                   style={{width:"90%"}}
                                   labelKey={option => `${option.search_term}`}

                                   renderMenuItemChildren={(option, { text }, index) => {
                                       return(
                                        <React.Fragment>
                                            <Row>
                                                <Col sm={11}>
                                            <Highlighter search={text}>
                                                {option.search_term}
                                            </Highlighter>

                                            <div>
                                                <small>
                                                   <ReactTimeAgo date={new Date(option.time)} locale="en-US"/>
                                                </small>

                                            </div>
                                                </Col>
                                                <Col sm={1.5} className={"mx-auto my-auto"}>
                                                    <Button size={"sm"} variant={"outline-dark"} className={"align-middle"}
                                                         onClick={ () =>
                                                        handleRemoveHistory(option)
                                                    }>
                                                    ✕
                                                </Button>
                                                </Col>
                                        </Row>
                                        </React.Fragment>)
                                    }}
                                   emptyLabel="No related history"/>
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