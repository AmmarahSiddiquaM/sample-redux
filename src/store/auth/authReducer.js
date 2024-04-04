import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGIN_REQUEST,
} from "./authActions";

const initialState = {
  isAuthenticated: null,
  loading: true,
  idToken: null,
  accessToken: null,
  refreshToken: null,
  isLoginFail: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        idToken: action.idToken,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        isLoginFail: false,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        idToken: null,
        accessToken: null,
        refreshToken: null,
        isLoginFail: true,
      };
    case LOGOUT:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        idToken: null,
        accessToken: null,
        refreshToken: null,
        isLoginFail: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;
