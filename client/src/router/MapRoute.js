import React from "react";
import { Route } from "react-router-dom";
import { PrivateRoute } from "./Protected";

export function MapRoute({ component: Component, isPrivate, ...rest }) {
  return isPrivate ? (
    <PrivateRoute {...rest} component={Component} />
  ) : (
    <Route component={Component} {...rest} />
  );
}
