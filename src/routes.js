import React, { Component } from "react"
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";

import auth from "./auth";


import Login from "./pages/Login";
import Home from "./pages/Home";

const PrivateRoute = ({component : Component, ...rest}) => (
  <Route {...rest} 
    render={props => auth.isAuthenticated() ?
      (<Component {...props} />) : 
      ( 
        <Redirect to={{pathname : '/login', state: {from: props.location}}} />
      )
    }
  />
);

export default function Routes(props) {
  return (

    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} exact/>
        <PrivateRoute exact path="/" component={Home} />
            
      </Switch>
    </BrowserRouter>
  )
}