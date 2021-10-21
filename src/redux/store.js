import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { RootReducer } from "./reducers";
import rootSaga from "./saga";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
export const store = createStore(RootReducer, applyMiddleware(sagaMiddleware));

// then run the saga
sagaMiddleware.run(rootSaga);
