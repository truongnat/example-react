import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./reducers";
import { rootSaga } from "./sagas";
import { composeWithDevTools } from "redux-devtools-extension";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middleware = process.env.REACT_APP_IS_DEV
  ? composeWithDevTools(applyMiddleware(sagaMiddleware))
  : applyMiddleware(sagaMiddleware);

// mount it on the Store
export const store = createStore(rootReducer, middleware);

if (process.env.REACT_APP_IS_DEV) {
  window.__store = store;
}

// then run the saga
sagaMiddleware.run(rootSaga);
