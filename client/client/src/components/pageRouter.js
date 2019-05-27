import React, { Component } from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import Register from './register'
import Login from './login'
import Home from './home'


export default class PageRouter extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/home" component={Home} />
                </Switch>
            </Router>
        )
    }
}
