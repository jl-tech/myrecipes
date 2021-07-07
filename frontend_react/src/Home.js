import React, { useState, useEffect } from 'react';

import { Link, Switch, Route, Redirect, NavLink } from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import DropdownButton from 'react-bootstrap/DropdownButton';

import logo from './WIP_logo_2.png';

import Cookie from 'universal-cookie';
import Profile from "./profile/profile.js";
import RecipeCreate from './recipe/create';
import RecipeView from './recipe/view';
import DeleteSuccess from "./recipe/deletesuccess";
import Form from "react-bootstrap/Form";
import {FormControl} from "react-bootstrap";

async function profileUser(id) {
    let response = await fetch('http://localhost:5000/profile/view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: id
        })
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
    return (
    <>
    <Navbar bg="light" variant="light">
        <Link to="/" >
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
        <Form inline>
            <FormControl  type="text" placeholder="Search Recipes" className=" mr-sm-2" />
            <Button type="submit" variant="outline-secondary">Search</Button>
        </Form>
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
            : (<Redirect to= {{pathname: "/"}} />)
        } />
        <Route path="/settings" render={() =>
            loggedIn
            ? (<Profile currId={currId} loggedIn={loggedIn} settings={true} setButtonName={setfirstName}/>)
            : (<Redirect to= {{pathname: "/"}} />)
        } />

        <Route path="/recipe/create" render={() => 
            loggedIn
            ? (<RecipeCreate />)
            : (<Redirect to= {{pathname: "/"}} />)
        } />
        <Route path="/recipe/deletesuccess">
          <DeleteSuccess/>
        </Route>
        <Route path="/recipe/:id">
          <RecipeView currId={currId} loggedIn={loggedIn} />
        </Route>
        <Route path="/recipe" render={() => 
            (<Redirect to= {{pathname: "/"}} />)
        } />

        <Route path="/">
            <>
                Work in progress
            </>
        </Route>
    </Switch>
    </>
    );
}

export default Home;
