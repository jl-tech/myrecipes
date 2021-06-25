import React, { useState, useEffect } from 'react';

// import 'bootstrap/dist/css/bootstrap.css';
import './App.scss';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
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
  }).catch(() => {
      return false;
  });

  return response.ok;
}

function VisitorRoute(props) {
  return (
    <Route
      render={({ location }) =>
        props.loggedIn ? (
          <Redirect to="/" />
        ) : (
          props.children
        )
      }
    />
  );
}

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [fetched, setFetched] = useState(false);
  const cookie = new Cookie();

  async function checkToken() {
    let token = cookie.get('token');
    if (token != null) {
      let response = await tokenVerify(token);
      if (response) setLoggedIn(true);
      else cookie.remove('token', {path: '/'});
    }
    setFetched(true);
  }

  useEffect(() => {
    if (!fetched) checkToken();
  })
  
  if (!fetched) return (<></>)

  return (
    <Router>
      <Switch>
        <VisitorRoute path="/login" loggedIn={loggedIn}>
          <Login />
        </VisitorRoute>
        <Route strict path="/emailconfirm/">
          <Home />
        </Route>
        <Route path="/emailconfirm">
          <EmailConfirm />
        </Route>
        <Route strict path="/resetpassword/">
          <ResetPassword />
        </Route>
        <Route path="/resetpassword">
          <ResetPassword />
        </Route>
        <Route path="/">
          <Home loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </Route>
        </Switch>
    </Router>
  )
}

export default App;
