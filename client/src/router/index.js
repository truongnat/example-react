import React, { useCallback, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PrivateRoute } from "./Protected";
import { Authenticate } from "../services";
import { useDispatch } from "react-redux";
import {
  CHECKING_AUTH,
  ENUM_STATUS,
  genericAction,
  LOADING_APP,
  LOGIN,
} from "../redux/actions";
import { routerConfig } from "../config";
import { MapRoute } from "./MapRoute";

export function RootRouter() {
  const dispatch = useDispatch();

  const checkAuth = useCallback(async () => {
    try {
      dispatch(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, false));
      // const dataUser = await new Authenticate().isAuthenticated();
      // dispatch(genericAction(LOGIN, ENUM_STATUS.SUCCESS, dataUser));
      // dispatch(
      // genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, !!dataUser)
      // );
      // dispatch(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, false));
    } catch (error) {
      // dispatch(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, false));
      // dispatch(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, false));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <Router>
      <Switch>
        {routerConfig.map((r) => (
          <MapRoute key={r.name} {...r} />
        ))}
      </Switch>
    </Router>
  );
}
