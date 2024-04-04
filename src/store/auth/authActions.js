export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
export const LOGIN_REQUEST = "LOGIN_REQUEST";

export const loginRequest = () => {
  return {
    type: LOGIN_REQUEST,
  };
};

export const login = (res) => {
  return {
    type: LOGIN_SUCCESS,
    idToken: res.idToken,
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
  };
};

export const loginFail = () => {
  return {
    type: LOGIN_FAIL,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};
