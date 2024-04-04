import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { /*useHistory*/ Navigate } from "react-router-dom";

//Context
import { useAuth } from "../../context/auth";

const CallbackPage = () => {
  //const history = useHistory();
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract token from query parameters
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const admin = params.get("admin");

    const authData = {
      user: {
        name,
        email,
        admin,
      },
      token,
    };

    //setAuth({ ...auth, token: data.token, user: data.user });

    const authCheck = async () => {
      try {
        //console.log("Token: ", token);
        const headers = {
          Authorization: token,
          "Content-Type": "application/json",
        };

        const { data } = await axios.get(`/auth/auth-check`, { headers });
        //console.log("data: ", data);
        if (data.ok) {
          setAuth({ ...auth, token: authData.token, user: authData.user });
          localStorage.setItem("auth", JSON.stringify(authData));
          // Update loading state
          setLoading(false);
        } else {
          toast.error("Invalid auth token");
          // Update loading state
          setLoading(false);
        }
      } catch (err) {
        console.log("Error in auth check: ", err);
      }
    };

    authCheck();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navigate to="/" />
    </>
  );
};

export default CallbackPage;
