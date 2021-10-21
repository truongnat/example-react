import React, { lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { PrivateRoute } from "./Protected";
import { Authenticate } from "../services";
import { useDispatch } from "react-redux";
import { CHECKING_AUTH, ENUM_STATUS, genericAction } from "../redux/actions";
const LazyHomePage = lazy(() => import("../pages/HomePage"));
const LazyLoginPage = lazy(() => import("../pages/LoginPage"));
export function RootRouter() {
  const dispatch = useDispatch();
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuthenticated = await new Authenticate().isAuthenticated();
    dispatch(
      genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, isAuthenticated)
    );
  };
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={LazyHomePage} />
        <Route path="/login" component={LazyLoginPage} />
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}
