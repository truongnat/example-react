import React, { lazy, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './Protected';
import { Authenticate } from '../services';
import { useDispatch } from 'react-redux';
import {
  CHECKING_AUTH,
  ENUM_STATUS,
  genericAction,
  LOADING_APP,
  LOGIN,
} from '../redux/actions';

const LazyHomePage = lazy(() => import('../pages/HomePage'));
const LazyLoginPage = lazy(() => import('../pages/LoginPage'));
const LazyRegisterPage = lazy(() => import('../pages/RegisterPage'));
const Lazy404Page = lazy(() => import('../pages/404Page'));
const LazyMyProfile = lazy(() => import('../pages/MyProfile'));

export function RootRouter() {
  const dispatch = useDispatch();

  const checkAuth = useCallback(async () => {
    try {
      const dataUser = await new Authenticate().isAuthenticated();
      dispatch(genericAction(LOGIN, ENUM_STATUS.SUCCESS, dataUser));
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
        <PrivateRoute exact path='/' component={LazyHomePage} />
        <PrivateRoute exact path='/my-profile' component={LazyMyProfile} />
        <Route path='/login' component={LazyLoginPage} />
        <Route path='/register' component={LazyRegisterPage} />
        <Route path='*' component={Lazy404Page} />
      </Switch>
    </Router>
  );
}
