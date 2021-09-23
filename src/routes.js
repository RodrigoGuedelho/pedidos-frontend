import React from "react"
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Home from "./pages/Home";
import CadProduto from "./pages/CadProduto";
import CadMesa from "./pages/CadMesa";
import ListProduto from "./pages/ListProduto"
import RelatorioPedido from "./pages/RelatorioPedido";

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
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/produtos" component={ListProduto} />
        <PrivateRoute exact path="/produtos/add" component={CadProduto} />
        <PrivateRoute exact path="/produtos/:id" component={CadProduto} />
        <PrivateRoute exact path="/mesas/add" component={CadMesa} />
        <PrivateRoute exact path="/pedidos/relatorio" component={RelatorioPedido} />
        
        <Route path="/login" component={Login} exact/>     
      </Switch>
    </BrowserRouter>
  )
}