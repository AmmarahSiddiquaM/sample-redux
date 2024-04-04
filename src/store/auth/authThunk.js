import * as AuthActions from "./authActions";
import * as AuthApi from "./authApi";

export const login = (response) => async (dispatch) => {
  dispatch(AuthActions.loginRequest());
  try {
    const res = await AuthApi.login({
      userId: response.userId, //"1AdazUsBR4Sz64akOMCilQ==", //"0TME/jqdjtft/f/Z5c5UwA==",
      clientNumber: response.clientNo, //"B3Uj8CpKzvfey5UemxjNag==", //"B3Uj8CpKzvfey5UemxjNag==",
    });
    dispatch(AuthActions.login(res.data));
  } catch (e) {
    dispatch(AuthActions.loginFail());
  }
};

export const logout = () => async (dispatch) => {
  dispatch(AuthActions.logout());
};

export const validateToken = (token) => async (dispatch) => {
  dispatch(AuthActions.loginRequest());
  try {
    const res = await AuthApi.validateToken(token);
    const idToken = sessionStorage.getItem("idToken");
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");
    dispatch(AuthActions.login({ idToken, accessToken, refreshToken }));
  } catch (e) {
    console.log({ e });
    dispatch(AuthActions.logout());
  }
};

export const getNewSession = (token, refreshToken) => async (dispatch) => {
  console.log("*********************************** Generating New Session ****************************************************");
  try {
    const res = await AuthApi.getNewSession(token, refreshToken);
    sessionStorage.setItem("idToken", res.data.idToken);
    sessionStorage.setItem("accessToken", res.data.accessToken);
    sessionStorage.setItem("refreshToken", res.data.refreshToken);
    validateToken(res.data.idToken);
  } catch (e) {
    console.log({ e });
    dispatch(AuthActions.logout());
  }
};


