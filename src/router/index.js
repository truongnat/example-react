import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useAuth } from "../hooks";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { FakeCookie } from "../utils";
import { ProtectedRoute } from "./Protected";
import { useHistory } from "react-router-dom";
export function RootRouter() {
  const { signIn } = useAuth();
  const history = useHistory();
  useEffect(() => {
    const info = FakeCookie.get("lp");
    if (info) {
      signIn(JSON.parse(info), () => {
        history.push("/");
      });
    }
  }, []);
  return (
    <Switch>
      <Route path="/login">
        <LoginPage />
      </Route>
      <ProtectedRoute path="/">
        <HomePage />
      </ProtectedRoute>
    </Switch>
  );
}
