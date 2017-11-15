'use strict'

import {
  BrowserRouter as Router,
  HashRouter,
  Redirect,
  Switch,
  Route
} from 'react-router-dom'

import React from 'react'

import App from './app.js'

require('./stylesheets/main.scss')

import ReactDOM from 'react-dom'

const app = document.getElementById("root")

ReactDOM.render((
    <HashRouter>
        <App />
    </HashRouter>
    ), app)
