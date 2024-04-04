import { combineReducers } from "redux";

import authReducer from "./auth/authReducer";
import RequestReducer from "./request/requestReducer";
import UserReducer from "./user/userReducer";

const appReducer = combineReducers({
  auth: authReducer,
  request: RequestReducer,
  user: UserReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
