import React, {useEffect, useState} from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Form from "react-bootstrap/Form";
import Cookie from 'universal-cookie';

import { useHistory } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

import InputGroup from "react-bootstrap/InputGroup";
import {Highlighter, Typeahead} from 'react-bootstrap-typeahead';
import CloseButton from 'react-bootstrap/CloseButton';
import SearchIconBig from "../search_white_24dp.svg";
import SearchIconSmall from "../search_white_18dp.svg";


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

async function requestDeleteHistory(search_term, time, token) {
    let response = await fetch('http://localhost:5000/search/history/remove', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            search_term: search_term,
            // from https://stackoverflow.com/questions/22806870/incorrect-datetime-value-database-error-number-1292
            time: new Date(time).toISOString().slice(0, 19).replace('T', ' ')
        })
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function SearchBar(props) {
    const history = useHistory()
    const [searchHistoryTerms, setSearchHistoryTerms] = useState([])
    const [historyFetched, setHistoryFetched] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const cookie = new Cookie()
    const searchInput = React.createRef();

    function handleSubmit(event) {
        event.preventDefault()
        let searchTerm = searchInput.current.getInput().getAttribute('value').trim();
        if (searchTerm === "") {
            history.push(`/search`)
        } else {
            history.push(`/search?name=${searchTerm}`)   
        }
        history.go();
    }

    function handleOnKeyDown(e) {
        if (e.key === 'Enter') {
            handleSubmit(e)
        }
    }

    async function processHistory() {
        let response = await getHistory(cookie.get('token'))
            .catch(e => {
            });

        if (response != null) {
            setSearchHistoryTerms(response)
        }

        setHistoryFetched(true);
    }

    function handleRemoveHistory(elementToRemove) {
        let temp = searchHistoryTerms
        temp.splice(searchHistoryTerms.indexOf(elementToRemove),1)
        setSearchHistoryTerms(temp)
        let response = requestDeleteHistory(elementToRemove.search_term, elementToRemove.time, cookie.get('token'))
            .catch(e => {

            });
        return "";
    }

    useEffect(() => {
        if (!historyFetched) processHistory();
    }, []);

    return (
        <Form onSubmit={handleSubmit} onKeyDown={handleOnKeyDown}>
            <InputGroup>
                <Typeahead id = 'typeahead' placeholder='Search Recipes' options={searchHistoryTerms}
                            style={{opacity:"90%", zIndex:1, width: props.nav ? "": "92%"}}
                            labelKey={option => `${option.search_term}`}
                            open={showSuggestions}
                            onFocus={()=> setShowSuggestions(true)}
                            onBlur={() => setShowSuggestions(false)}
                            defaultInputValue={props.init}
                            ref={searchInput}
                            disabled={props.disabled}
                            renderMenuItemChildren={(option, { text }, index) => {
                                return(
                                <React.Fragment>
                                    <Row>
                                        <Col sm={props.nav ? 7 : 10} className="text-truncate">
                                        <Highlighter search={text} style={{verticalAlign:"text-bottom", lineHeight:"2em"}}>
                                            {option.search_term}
                                        </Highlighter>
                                        </Col><Col sm={1}>
                                        <small style={{color: "gray", float:"right", verticalAlign:"text-bottom", lineHeight:"2em"}}>
                                            &nbsp; <ReactTimeAgo date={new Date(option.time)} timeStyle={"twitter"} locale="en-US"/>
                                        </small>
                                        </Col>
                                        <Col sm={1} className={"mx-auto my-auto"}>
                                            <div style={{position: "relative", top: "-0.1em"}}>
                                            <CloseButton
                                                className={"align-middle"}
                                                onClick={ () =>
                                                option.search_term = handleRemoveHistory(option)}
                                            />
                                            </div>
                                        </Col>
                                    </Row>
                                </React.Fragment>)
                            }}
                            emptyLabel= {props.loggedIn ? "No related history": "Log in to view your search history"}/>
                <InputGroup.Append>
                    <Button type="submit" size="sm" variant="primary" disabled={props.disabled}>
                        <img src={props.nav ? SearchIconSmall : SearchIconBig} alt=""/>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );

}

export default SearchBar;