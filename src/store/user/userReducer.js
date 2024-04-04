import {
  FETCH_USER_FAIL,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
} from "./userActions";

const initialState = {
  loading: true,
  userData: null,
  isGetUserDataFail: null,
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: action.data,
        isGetUserDataFail: false,
      };
    case FETCH_USER_FAIL:
      return {
        ...state,
        loading: false,
        userData: null,
        isGetUserDataFail: true,
      };
    default:
      return state;
  }
};

export default UserReducer;
