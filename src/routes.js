import React, { Component } from "react"
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";

import auth from "./auth";


import Login from "./pages/Login";


const PrivateRoute = ({component : Component, ...rest}) => (
  <Route {...rest} 
    render={props => auth.isAuthenticated() ?
      (<> 
        <Layout />
        <Component {...props} />
      </>) : 
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