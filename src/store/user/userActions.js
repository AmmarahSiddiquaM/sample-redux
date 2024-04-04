export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAIL = "FETCH_USER_FAIL";
export const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";

export const getUserRequest = () => {
  return {
    type: FETCH_USER_REQUEST,
  };
};

export const getUserSuccess = (res) => {
  return {
    type: FETCH_USER_SUCCESS,
    data: res,
  };
};

export const getUserFail = () => {
  return {
    type: FETCH_USER_FAIL,
  };
};
