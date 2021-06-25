import logo from './logo.svg';

import React, { useState, useEffect } from 'react';

// import 'bootstrap/dist/css/bootstrap.css';
import './App.scss';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import Login from './auth/login.js';
import EmailConfirm from './auth/emailconfirm.js';
import ResetPassword from './auth/resetpassword.js';

function Home() {
  return (<div>Work in progress</div>);
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
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
          <Home />
        </Route>
        </Switch>
    </Router>
  )
}

export default App;
