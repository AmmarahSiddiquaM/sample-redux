import * as RequestActions from "./requestActions";
import * as RequestApi from "./requestApi";

export const getRequests = (params) => async (dispatch) => {
  dispatch(RequestActions.fetchRequestStart());
  try {
    const res = await RequestApi.getRequests(params);
    dispatch(RequestActions.fetchRequestSuccess(res.data));
  } catch (e) {
    console.log({ e });
    dispatch(RequestActions.fetchRequestFail());
  }
};


