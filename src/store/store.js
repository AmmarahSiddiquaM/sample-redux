import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

import rootReducer from "./rootReducer";

const initialState = {};

const middlewares = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middlewares)
);

export default store;
