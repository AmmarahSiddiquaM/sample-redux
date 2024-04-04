import {
  FETCH_REQUESTS_FAIL,
  FETCH_REQUESTS_START,
  FETCH_REQUESTS_SUCCESS,
} from "./requestActions";

const initialState = {
  loading: false,
  totalRecords: null,
  currentPage: null,
  totalPages: null,
  recordsInPage: null,
  requests: [],
  error: null,
};

const RequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REQUESTS_START:
      return {
        ...state,
        requests: [],
        loading: true,
      };
    case FETCH_REQUESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        requests: action.requests,
        totalRecords: action.totalRecords,
        currentPage: action.currentPage,
        totalPages: action.totalPages,
        recordsInPage: action.recordsInPage,
      };
    case FETCH_REQUESTS_FAIL:
      return {
        ...state,
        loading: false,
        requests: [],
        error: action.payload,
        totalRecords: null,
        currentPage: null,
        totalPages: null,
        recordsInPage: null,
      };
    default:
      return state;
  }
};

export default RequestReducer;
