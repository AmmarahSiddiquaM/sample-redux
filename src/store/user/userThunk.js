import * as UserActions from "./userActions";
import * as UserApi from "./userApi";

export const getUserDetails = () => async (dispatch) => {
  dispatch(UserActions.getUserRequest());
  try {
    const res = await UserApi.getUserDetails();
    dispatch(UserActions.getUserSuccess(res.data));
  } catch (e) {
    dispatch(UserActions.getUserFail());
  }
};
