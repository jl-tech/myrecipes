import React, { useState, useEffect } from 'react';

import { Link } from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';

import DropdownButton from 'react-bootstrap/DropdownButton';

import logo from './WIP_logo_2.png';

import Cookie from 'universal-cookie';

function LoginButton() {
    return (
        <Link to="/login">Log In</Link>
    );
}

function UserButton(props) {
    const cookie = new Cookie();
    
    function logout() {
        cookie.remove('token', {path: '/'});
        props.setLoggedIn(false);
    }

    return (
    <DropdownButton menuAlign="right" title="name" >
        <Link component={Dropdown.Item} to="/profile">Profile</Link>
        <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
    </DropdownButton>
    );
}

function Home({ loggedIn, ...rest }) {
    
    return (
    <>
    <Navbar bg="dark" variant="dark">
        <Link to="/" component={Navbar.Brand} >
            <img src={logo} height="50" />
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
                {loggedIn ? <UserButton {...rest}/> : <LoginButton />}
            </Navbar.Text>
        </Navbar.Collapse>
    </Navbar>
    </>
    );
}

export default Home;
