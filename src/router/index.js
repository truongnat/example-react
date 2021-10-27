import React, {lazy, useCallback, useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import {PrivateRoute} from "./Protected";
import {Authenticate} from "../services";
import {useDispatch} from "react-redux";
import {
    CHECKING_AUTH,
    ENUM_STATUS,
    genericAction,
    LOADING_APP, LOGIN,
} from "../redux/actions";

const LazyHomePage = lazy(() => import("../pages/HomePage"));
const LazyLoginPage = lazy(() => import("../pages/LoginPage"));

export function RootRouter() {
    const dispatch = useDispatch();

    const checkAuth = useCallback(async () => {
        try {
            const dataUser = await new Authenticate().isAuthenticated();
            dispatch(
                genericAction(LOGIN, ENUM_STATUS.SUCCESS, dataUser)
            );
            dispatch(
                genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, !!dataUser)
            );
            dispatch(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, false));
        } catch (error) {
            dispatch(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, false));
            dispatch(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, false));
        }
    }, [dispatch]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    return (
        <Router>
            <Switch>
                <PrivateRoute exact path="/" component={LazyHomePage}/>
                <Route path="/login" component={LazyLoginPage}/>
                <Redirect from="*" to="/"/>
            </Switch>
        </Router>
    );
}
