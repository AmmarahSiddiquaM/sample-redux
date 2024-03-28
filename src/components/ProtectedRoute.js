import { useEffect, useState } from "react";
//import { Navigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/auth";

import Redirection from "./Redirection";

const ProtectedRoutes = ({ children }) => {
  //   const isAuth = JSON.parse(localStorage.getItem("isAuth") || false);
  //   return isAuth ? children : <Navigate to="/" />;

  // context
  const [auth /*, setAuth*/] = useAuth();
  // state
  const [ok, setOk] = useState(false);

  console.log("Auh data from protected route: ", auth);

  useEffect(() => {
    const authCheck = async () => {
      const { data } = await axios.get(`/auth/auth-check`);
      console.log("data: ", data);
      if (data.ok) {
        console.log("setting ok as true");
        setOk(true);
      } else {
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  //return ok ? children : <Navigate to="/" />;
  return ok ? children : <Redirection />;
};

export default ProtectedRoutes;
