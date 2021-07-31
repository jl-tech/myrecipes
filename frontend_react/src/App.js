import React, {useEffect, useState} from 'react';

// import 'bootstrap/dist/css/bootstrap.css';
import './App.scss';

import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch
} from "react-router-dom";

import Cookie from 'universal-cookie';

import Login from './auth/login.js';
import EmailConfirm from './auth/emailconfirm.js';
import ResetPassword from './auth/resetpassword.js';
import Home from './Home.js';

async function tokenVerify(token) {
    let response = await fetch('http://localhost:5000/auth/verify', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    }).catch(e => {
        return {'user_id': -1, 'status': 2};
    });

    let responseJson = await response.json();

    return responseJson;
}

function VisitorRoute(props) {
    return (
        <Route
            render={({location}) =>
                props.loggedIn ? (
                    <Redirect to="/home"/>
                ) : (
                    props.children
                )
            }
        />
    );
}

function App() {

    const [loggedIn, setLoggedIn] = useState(false);
    // Whether the API request has finished being fetched
    const [fetched, setFetched] = useState(false);
    const [currId, setCurrId] = useState(null);
    const cookie = new Cookie();

    async function checkToken() {
        let token = cookie.get('token');
        if (token != null) {
            let response = await tokenVerify(token)
                .catch(() => {

                });

            if (response != null) {
                if (response.status === 0) {
                    setCurrId(response.user_id);
                    setLoggedIn(true);
                } else if (response.status === 1) {
                    cookie.remove('token', {path: '/'});
                } else {
                    setLoggedIn(true);
                }
            }
        }

        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) checkToken();
    }, []);

    if (!fetched) return (<></>)

    return (
        <Router>
            <Switch>
                <VisitorRoute path="/login" loggedIn={loggedIn}>
                    <Login/>
                </VisitorRoute>
                <Route path="/emailconfirm">
                    <EmailConfirm/>
                </Route>
                <Route path="/resetpassword">
                    <ResetPassword/>
                </Route>
                <Route path="/">
                    <Home loggedIn={loggedIn} setLoggedIn={setLoggedIn}
                          currId={currId}/>
                </Route>
            </Switch>
        </Router>
    )
}

export default App;
