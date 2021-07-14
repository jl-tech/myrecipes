import Container from "react-bootstrap/Container";
import {Spinner} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Dropdown from "react-bootstrap/Dropdown";
import SearchResults from "./searchresults";

function Search(props) {
    const [searchTerm, setSearchTerm] = useState("")
    const [errorShow, setErrorShow] = useState(false)
    const [query, setQuery] = useState(new URLSearchParams(window.location.search).get('query'));
    const history = useHistory()
    async function handleSubmit(event) {
        event.preventDefault()
        if (searchTerm === "") {
            setErrorShow(true)
        } else {
            history.push(`/search?query=${searchTerm}`)
        }

    }
    console.log(props)
    return (
        <>
            <Container style={{marginTop:"5vh"}}>
                <Row className={'justify-content-center'}>
                <Form.Control size="lg" type="text" placeholder="🔎︎ New search"
                                  style={{background: 'white', textAlign: "center", textColor:"black"}}
                                  defaultValue={query} required onChange={e => setSearchTerm(e.target.value)}/>

                                  <Button onClick={handleSubmit}> Search </Button>
                    </Row>
                <h1> Search results for "{query}" </h1>
                <Dropdown>
                    <Dropdown.Toggle  size="sm" variant="outline-secondary" id="dropdown-basic">
                        Sort by
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item> Default </Dropdown.Item>
                        <Dropdown.Item> Cooking time </Dropdown.Item>
                        <Dropdown.Item> Likes </Dropdown.Item>
                    </Dropdown.Menu>
                    <Button> Filter </Button>

                </Dropdown>
                <SearchResults user_id={2}/>
            </Container>
        </>
    )
}

export default Search