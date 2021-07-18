import React, { useState, useEffect } from 'react';

import {
    Link,
    Switch,
    Route,
    Redirect,
    NavLink,
    useHistory,
    useLocation
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
import SearchResults from "./search/results";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";

import SearchIcon from "./search_white_18dp.svg";

import {Highlighter, Typeahead} from 'react-bootstrap-typeahead';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReactTimeAgo from "react-time-ago";
import SearchBar from './search/bar';
import Image from "react-bootstrap/Image";
import Feed from './newsfeed/feed';

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
    <DropdownButton menuAlign="right" title={
        <>
         <Image src={"http://127.0.0.1:5000/img/" + imgUrl} alt="Profile Picture" roundedCircle width="25em"
         style={{padding: 0 + '!important'}}/>
         &nbsp; {props.firstName}
        </>
        }>
        <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
        {
            !useLocation().pathname.includes('/profile/') ?
            <Dropdown.Item as={Link} to="/settings">Account
                Settings</Dropdown.Item> :
              null
        }
        <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
    </DropdownButton>
    );
}

function Home({ loggedIn, setLoggedIn, currId }) {

    const [firstName, setfirstName] = useState('');
    const location = useLocation();

    return (
    <>
    <Navbar style={{height: "4em"}} bg="light" variant="light" className={"shadow-sm"}>
        <Link to="/home" >
            <img src={logo} height="40vh" />
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
        {location.pathname != "/home" && location.pathname != "/search" ? <SearchBar nav={true} loggedIn={loggedIn} /> : <></>}
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
            <SearchResults loggedIn={loggedIn}/>
        </Route>
        <Route path="/newsfeed/:page">
            <Feed loggedIn={loggedIn} currId={currId}/>
        </Route>
        <Route path="/newsfeed">
            <Feed loggedIn={loggedIn} currId={currId}/>
        </Route>

        <Route path="/home">
            <HomePage loggedIn={loggedIn}/>
        </Route>
        <Route path="/" render={() => 
            (<Redirect to= {{pathname: "/home"}} />)
        } />
    </Switch>
    </>
    );
}

export default Home;
