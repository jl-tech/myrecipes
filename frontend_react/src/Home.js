import React, { useState, useEffect } from 'react';

import {
    Link,
    Switch,
    Route,
    Redirect,
    NavLink,
    useHistory
} from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';

import DropdownButton from 'react-bootstrap/DropdownButton';

import logo from './WIP_logo_2.png';

import Cookie from 'universal-cookie';
import Profile from "./profile/profile.js";
import RecipeCreate from './recipe/create';
import RecipeView from './recipe/view';
import DeleteSuccess from "./recipe/deletesuccess";
import Form from "react-bootstrap/Form";
import {FormControl} from "react-bootstrap";
import HomePage from "./HomePage";
import Search from "./search/search";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";

import SearchIcon from "./search_white_18dp.svg";

import {Highlighter, Typeahead} from 'react-bootstrap-typeahead';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReactTimeAgo from "react-time-ago";

async function profileUser(userid) {
    let response = await fetch('http://localhost:5000/profile/view?' + new URLSearchParams({'user_id': userid}), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function LoginButton() {
    return (
        <Link to="/login">
            <Button style={{color:"white"}}>
                Log in
            </Button>
        </Link>
    );
}

function UserButton(props) {
    const cookie = new Cookie();
    const [imgUrl, setImgUrl] = useState('');
    const [fetched, setFetched] = useState(false);

    async function processId() {
        let response = await profileUser(props.currId)
            .catch(e => {
                console.log(props.currId);
            });

        if (response != null) {
            props.setfirstName(response.FirstName);
            setImgUrl(response.ProfilePictureURL);
        }

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);
    
    function logout() {
        cookie.remove('token', {path: '/'});
        props.setLoggedIn(false);
    }

    return (
    <DropdownButton menuAlign="right" title={props.firstName} >
        <Link component={Dropdown.Item} to="/profile">Profile</Link>
        <Link component={Dropdown.Item} to={"/settings"}> Account Settings </Link>
        <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
    </DropdownButton>
    );
}

function Home({ loggedIn, setLoggedIn, currId }) {

    const [firstName, setfirstName] = useState('');
    const [navSearchTerm, setNavSearchTerm] = useState('')
    const [errorShow, setErrorShow] = useState(false)
    const history = useHistory()
    const [searchHistoryTerms, setSearchHistoryTerms] = useState([])
    const [historyFetched, setHistoryFetched] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const cookie = new Cookie()

    async function handleSearch(event) {
        event.preventDefault()
        if (navSearchTerm === "") {
            setErrorShow(true)
        } else {
            history.push(`/search?query=${navSearchTerm}`)
        }

    }
    async function handleOnKeyDown(e) {
        if (e.key === 'Enter') {
            handleSearch(e)
        }
    }

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

    function handleRemoveHistory(elementToRemove) {
        let temp = searchHistoryTerms
        temp.splice(searchHistoryTerms.indexOf(elementToRemove),1)
        setSearchHistoryTerms(temp)
        let response = requestDeleteHistory(elementToRemove.search_term, elementToRemove.time, cookie.get('token'))
            .catch(e => {

            });
        return ""
    }

    useEffect(() => {
        if (!historyFetched) processHistory();
    }, []);


    return (
    <>
    <Navbar bg="light" variant="light">
        <Link to="/home" >
            <img src={logo} height="50" />
        </Link>

        <NavLink style={{paddingLeft: '2rem', fontSize:"125%"}} to="/home" activeStyle={{ paddingLeft: '2rem', fontWeight: 'bold', fontSize:"125%"}}>
            Home
        </NavLink>
        <NavLink style={{paddingLeft: '2rem', fontSize:"125%"}} to="/newsfeed" activeStyle={{ paddingLeft: '2rem', fontWeight: 'bold', fontSize:"125%"}}>
            Newsfeed
        </NavLink>
        <NavLink style={{paddingLeft: '2rem', paddingRight: '2rem', fontSize:"125%"}} to="/recipe/create" activeStyle={{ paddingLeft: '2rem', fontWeight: 'bold', fontSize:"125%"}}>
            Create
        </NavLink>
        <Form onSubmit={handleSearch}>
            <InputGroup className={"input-group-sm"}>
                {/* <Dropdown onToggle={()=> setShowSuggestions(false)} show={showSuggestions}>
                <FormControl type="text" placeholder="Search Recipes"
                    required onChange={e => setNavSearchTerm(e.target.value)}
                    onKeyDown={handleOnKeyDown} onClick={toggleSuggestions} />
                <Dropdown.Menu style={{width:"100%"}} >
                    <Dropdown.Item>Apple</Dropdown.Item>
                    <Dropdown.Item>Chicken</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Clear All</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown> */}
                <Typeahead placeholder='Search Recipes' options={searchHistoryTerms}
                                   labelKey={option => `${option.search_term}`}
                                   open={showSuggestions}
                                   onFocus={()=> setShowSuggestions(true)}
                                   onBlur={() => setShowSuggestions(false)}
                                    onInputChange={(text, event) => setNavSearchTerm(text)}
                                   renderMenuItemChildren={(option, { text }, index) => {
                                       return(
                                        <React.Fragment>
                                            <Row>
                                                <Col sm={10}>
                                            <Highlighter search={text} style={{verticalAlign:"text-bottom", lineHeight:"2em"}}>
                                                {option.search_term}
                                            </Highlighter>
                                             <small style={{color: "gray", float:"right", verticalAlign:"text-bottom", lineHeight:"2em"}}>
                                                   &nbsp; <ReactTimeAgo date={new Date(option.time)} timeStyle={"twitter"} locale="en-US"/>
                                                </small>

                                                </Col>
                                                <Col sm={1.5} className={"mx-auto my-auto"}>
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
                                   emptyLabel={loggedIn ? "No related history" : "Log in for search history"}/>
                <InputGroup.Append>
                    <Button size="sm" type="submit" variant="primary">
                        <img src={SearchIcon} />
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
        <Alert show={errorShow} variant="warning" onClose={() => setErrorShow(false)} dismissible>
                        Please enter a search term.
        </Alert>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
                {loggedIn ? <UserButton setLoggedIn={setLoggedIn} currId={currId} firstName={firstName} setfirstName={setfirstName} /> : <LoginButton />}
            </Navbar.Text>
        </Navbar.Collapse>
    </Navbar>
    <Switch>

        <Route path="/profile/:id">
          <Profile currId={currId} loggedIn={loggedIn} settings={false} setButtonName={setfirstName}/>
        </Route>
        <Route path="/profile" render={() =>
            loggedIn
            ? (<Redirect to={{pathname: "/profile/" + currId}} />)
            : (<Redirect to= {{pathname: "/login"}} />)
        } />
        <Route path="/settings" render={() =>
            loggedIn
            ? (<Profile currId={currId} loggedIn={loggedIn} settings={true} setButtonName={setfirstName}/>)
            : (<Redirect to= {{pathname: "/login"}} />)
        } />

        <Route path="/recipe/create" render={() => 
            loggedIn
            ? (<RecipeCreate />)
            : (<Redirect to= {{pathname: "/login"}} />)
        } />
        <Route path="/recipe/deletesuccess">
          <DeleteSuccess/>
        </Route>
        <Route path="/recipe/:id">
          <RecipeView currId={currId} loggedIn={loggedIn} />
        </Route>
        <Route path="/recipe" render={() => 
            (<Redirect to= {{pathname: "/login"}} />)
        } />
        <Route path="/search">
            <Search/>
        </Route>

        <Route path="/home">
            <HomePage loggedIn={loggedIn}/>
        </Route>
        <Route path="/">
            <HomePage loggedIn={loggedIn}/>
        </Route>
    </Switch>
    </>
    );
}

export default Home;
