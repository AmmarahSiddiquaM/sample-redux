import { useEffect, useState } from "react";
//import { Navigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/auth";

import Loader from "./Loader";

const ProtectedRoutes = ({ children }) => {
  // context
  const [auth /*, setAuth*/] = useAuth();
  // state
  const [ok, setOk] = useState(false);

  //console.log("Auh data from protected route: ", auth);

  useEffect(() => {
    const authCheck = async () => {
      const { data } = await axios.get(`/auth/auth-check`);
      //console.log("data: ", data);
      if (data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  //return ok ? children : <Navigate to="/" />;
  return ok ? children : <Loader timeInSeconds="3" />;
};

export default ProtectedRoutes;
