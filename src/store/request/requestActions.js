export const FETCH_REQUESTS_START = "FETCH_REQUESTS_START";
export const FETCH_REQUESTS_SUCCESS = "FETCH_REQUESTS_SUCCESS";
export const FETCH_REQUESTS_FAIL = "FETCH_REQUESTS_FAIL";

export const fetchRequestStart = () => {
  return {
    type: FETCH_REQUESTS_START,
  };
};

export const fetchRequestSuccess = (res) => {
  return {
    type: FETCH_REQUESTS_SUCCESS,
    requests: res.requests,
    totalRecords: res.totalRecords,
    currentPage: res.currentPage,
    totalPages: res.totalPages,
    recordsInPage: res.recordsInPage,
  };
};

export const fetchRequestFail = (err) => {
  return {
    type: FETCH_REQUESTS_FAIL,
    payload: err,
  };
};
