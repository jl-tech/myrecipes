import React, { useState, useEffect } from 'react';


import {
    Link,
    Switch,
    Route,
    Redirect,
    NavLink,
    useLocation
} from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import DropdownButton from 'react-bootstrap/DropdownButton';

import logo from './WIP_logo_2.png';

import Cookie from 'universal-cookie';
import Profile from "./profile/profile.js";
import RecipeCreate from './recipe/create';
import RecipeView from './recipe/view';
import HomePage from "./HomePage";
import SearchResults from "./search/results";
import SearchBar from './search/bar';
import Image from "react-bootstrap/Image";
import Feed from './newsfeed/feed';
import NotFound from "./404";
import Users from "./users";
import ChatBot from "./chatbot/chatbot";
import ChatBox from "react-chat-plugin";
import Container from "react-bootstrap/Container";

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
    const [imgUrl, setImgUrl] = useState(null);
    const [fetched, setFetched] = useState(false);
    const location = useLocation();

    async function processId() {
        let response = await profileUser(props.currId)
            .catch(e => {
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
            imgUrl == null ? <></> :
                <>
                    <Image src={"http://127.0.0.1:5000/img/" + imgUrl} alt="Profile Picture" roundedCircle width="25em"
                           style={{padding: 0 + '!important'}}/>
                    &nbsp; {props.firstName}
                </>
        }>
            <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
            {location.pathname.includes('/profile') || location.pathname.includes('/settings') ?
                <Dropdown.Item onClick={()=>window.location.href="/settings"} >Account Settings</Dropdown.Item>:
                <Dropdown.Item as={Link} to="/settings" >Account Settings</Dropdown.Item>
            }
            <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
        </DropdownButton>
    );
}

function Home({ loggedIn, setLoggedIn, currId }) {

    const [firstName, setfirstName] = useState('');
    const location = useLocation();
    const [modalToggle, setModalToggle] = useState(false);


    return (
        <>
            <Navbar style={{height: "4em"}} bg="light" variant="light" className={"shadow-sm"}>
                <Link to="/" >
                    <img src={logo} height="40vh" alt="" />
                </Link>

                <NavLink style={{paddingLeft: '2rem', fontSize:"125%"}} to="/home" activeStyle={{ paddingLeft: '2rem', fontWeight: 'bold', fontSize:"125%"}}>
                    Home
                </NavLink>
                {loggedIn ?<>
                    <NavLink style={{paddingLeft: '2rem', fontSize:"125%"}} to="/newsfeed" activeStyle={{ paddingLeft: '2rem', fontWeight: 'bold', fontSize:"125%"}}>
                        Newsfeed
                    </NavLink>
                    <NavLink style={{paddingLeft: '2rem', fontSize:"125%"}} to="/recipe/create" activeStyle={{ paddingLeft: '2rem', fontWeight: 'bold', fontSize:"125%"}}>
                        Create
                    </NavLink> </>:<></>}
                <NavLink style={{paddingLeft: '2rem', fontSize:"125%"}} to="/users" activeStyle={{ paddingLeft: '2rem', fontWeight: 'bold', fontSize:"125%"}}>
                    Find Users
                </NavLink>
                {location.pathname !== "/home" && location.pathname !== "/search" ? <div style={{paddingLeft: '2rem'}}>  <SearchBar isHome={false} nav={true} loggedIn={loggedIn} /> </div>: <></>}
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {loggedIn ? <UserButton setLoggedIn={setLoggedIn} currId={currId} firstName={firstName} setfirstName={setfirstName} setModalToggle={setModalToggle}/> : <LoginButton />}
                    </Navbar.Text>
                </Navbar.Collapse>
                <ChatBot firstName={loggedIn ? " " + firstName : ""} style={{borderRadius: "15px 15px 15px 15px"}}/>
            </Navbar>

            <Switch>
                <Route path="/profile/:id">
                    <Profile currId={currId} loggedIn={loggedIn} settings={false} setButtonName={setfirstName} modalToggle={modalToggle} setModalToggle={setModalToggle}/>
                </Route>
                <Route path="/profile" render={() =>
                    loggedIn
                        ? (<Redirect to={{pathname: "/profile/" + currId}} />)
                        : (<Redirect to= {{pathname: "/"}} />)
                } />
                <Route path="/settings" render={() =>
                    loggedIn
                        ? (<Profile currId={currId} loggedIn={loggedIn} settings={true} setButtonName={setfirstName} modalToggle={modalToggle} setModalToggle={setModalToggle}/>)
                        : (<Redirect to= {{pathname: "/"}} />)
                } />

                <Route path="/recipe/create" render={() =>
                    loggedIn
                        ? (<RecipeCreate />)
                        : (<Redirect to= {{pathname: "/"}} />)
                } />
                <Route path="/recipe/:id">
                    <RecipeView currId={currId} loggedIn={loggedIn} />
                </Route>
                <Route path="/recipe" render={() =>
                    (<Redirect to= {{pathname: "/"}} />)
                } />
                <Route path="/users">
                    <Users/>
                </Route>
                <Route path="/search">
                    <SearchResults loggedIn={loggedIn}/>
                </Route>
                <Route path="/newsfeed/:page" render={() =>
                    loggedIn
                        ? (<Feed loggedIn={loggedIn} currId={currId}/>)
                        : (<Redirect to= {{pathname: "/"}} />)
                } />

                <Route path="/newsfeed" render={() =>
                    loggedIn
                        ? (<Feed loggedIn={loggedIn} currId={currId}/>)
                        : (<Redirect to= {{pathname: "/"}} />)
                } />

                <Route path="/home">
                    <HomePage loggedIn={loggedIn}/>
                </Route>
                <Route exact path="/" render={() =>
                    loggedIn
                        ? (<Redirect to= {{pathname: "/newsfeed"}} />)
                        : (<Redirect to= {{pathname: "/home"}} />)
                } />
                <Route>
                    <NotFound/>
                </Route>
            </Switch>


        </>

    );
}

export default Home;
