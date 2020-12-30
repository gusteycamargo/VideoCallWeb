import React from 'react'
import { Route, Switch } from "react-router-dom";
import Call from '../pages/Call';
import Login from "../pages/Login";

const Routes = () => (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/call" component={Call} />
      <Route path="*" component={() => <h1>Not found</h1>} />
    </Switch>
);

export default Routes;