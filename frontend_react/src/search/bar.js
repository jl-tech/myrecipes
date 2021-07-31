/**
 * A reusable search bar component providing search field and search history.
 */

import React, { useEffect, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";
import Cookie from "universal-cookie";

import { useHistory } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

import InputGroup from "react-bootstrap/InputGroup";
import { Highlighter, Typeahead } from "react-bootstrap-typeahead";
import CloseButton from "react-bootstrap/CloseButton";
import SearchIconBig from "../search_white_24dp.svg";
import SearchIconSmall from "../search_white_18dp.svg";

/**
 * Performs the API request for /search/history and returns the result.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting search history
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function getHistory(token) {
    let response = await fetch("http://localhost:5000/search/history", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

/**
 * Performs the API request for /search/history/remove and returns the result.
 * @throws The error if the API request was not successful.
 * @param token - the token of the user requesting search history
 * @param search_term - the term to remove
 * @param time - the time the history item was added
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestDeleteHistory(search_term, time, token) {
    let response = await fetch("http://localhost:5000/search/history/remove", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify({
            search_term: search_term,
            // from https://stackoverflow.com/questions/22806870/incorrect-datetime-value-database-error-number-1292
            time: new Date(time).toISOString().slice(0, 19).replace("T", " "),
        }),
    }).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function SearchBar(props) {
    const history = useHistory();
    // The list of search history terms as {term, timestamp}
    const [searchHistoryTerms, setSearchHistoryTerms] = useState([]);
    // Whether the history has been fetched
    const [historyFetched, setHistoryFetched] = useState(false);
    // Whether the history/suggestions pane should be opened (opened on focus)
    const [showSuggestions, setShowSuggestions] = useState(false);
    // Whether the search bar is hovered (to support shadow effect)
    const [isHovered, setIsHovered] = useState(false);
    const cookie = new Cookie();
    const searchInput = React.createRef();

    function handleSubmit(event) {
        event.preventDefault();
        let searchTerm = searchInput.current
            .getInput()
            .getAttribute("value")
            .trim();
        if (searchTerm === "") {
            history.push(`/search`);
        } else {
            history.push(`/search?name=${searchTerm}`);
        }
        history.go();
    }

    function handleOnKeyDown(e) {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    }

    /**
     * Calls and awaits for the history request function and sets the component state
     * based on the response.
     */
    async function processHistory() {
        let response = await getHistory(cookie.get("token")).catch((e) => {});

        if (response != null) {
            setSearchHistoryTerms(response);
        }

        setHistoryFetched(true);
    }

    /**
     * Calls and awaits for the remove history function and sets the component state
     * based on the response.
     */
    function handleRemoveHistory(elementToRemove) {
        let temp = searchHistoryTerms;
        temp.splice(searchHistoryTerms.indexOf(elementToRemove), 1);
        setSearchHistoryTerms(temp);
        requestDeleteHistory(
            elementToRemove.search_term,
            elementToRemove.time,
            cookie.get("token")
        ).catch((e) => {});
        return "";
    }

    useEffect(() => {
        if (!historyFetched) processHistory();
    }, []);

    return (
        <Form
            onSubmit={handleSubmit}
            onKeyDown={handleOnKeyDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={isHovered ? "shadow-lg" : "shadow-sm"}
        >
            <InputGroup>
                <Typeahead
                    id="typeahead"
                    placeholder="Search Recipes"
                    options={searchHistoryTerms}
                    style={{
                        opacity: "95%",
                        zIndex: 1,
                        width: props.nav ? "" : "92%",
                    }}
                    labelKey={(option) => `${option.search_term}`}
                    open={showSuggestions}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setShowSuggestions(false)}
                    defaultInputValue={props.init}
                    ref={searchInput}
                    disabled={props.disabled}
                    renderMenuItemChildren={(option, { text }, index) => {
                        return (
                            <React.Fragment>
                                <Row>
                                    <Col
                                        sm={props.nav ? 7 : 10}
                                        className="text-truncate"
                                    >
                                        <Highlighter
                                            search={text}
                                            style={{
                                                verticalAlign: "text-bottom",
                                                lineHeight: "2em",
                                            }}
                                        >
                                            {option.search_term}
                                        </Highlighter>
                                    </Col>
                                    <Col sm={1}>
                                        <small
                                            style={{
                                                color: "gray",
                                                float: "right",
                                                verticalAlign: "text-bottom",
                                                lineHeight: "2em",
                                            }}
                                        >
                                            &nbsp;{" "}
                                            <ReactTimeAgo
                                                date={new Date(option.time)}
                                                timeStyle={"twitter"}
                                                locale="en-US"
                                            />
                                        </small>
                                    </Col>
                                    <Col sm={1} className={"mx-auto my-auto"}>
                                        <div
                                            style={{
                                                position: "relative",
                                                top: "-0.1em",
                                            }}
                                        >
                                            <CloseButton
                                                className={"align-middle"}
                                                onClick={() =>
                                                    (option.search_term =
                                                        handleRemoveHistory(
                                                            option
                                                        ))
                                                }
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </React.Fragment>
                        );
                    }}
                    emptyLabel={
                        props.loggedIn
                            ? "No related history"
                            : "Log in to view search history"
                    }
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        size="sm"
                        variant="primary"
                        disabled={props.disabled}
                    >
                        <img
                            src={props.nav ? SearchIconSmall : SearchIconBig}
                            alt=""
                        />
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

export default SearchBar;
