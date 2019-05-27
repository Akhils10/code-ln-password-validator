import React, {Fragment, Component } from 'react'
import PageRouter from './components/pageRouter'

import './App.css'
import 'bootstrap/dist/css/bootstrap.css'

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <PageRouter />
      </Fragment>
    )
  }
}
