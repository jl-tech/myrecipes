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

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
            <div></div>
        </Route>
        </Switch>
    </Router>
  )
}

export default App;
