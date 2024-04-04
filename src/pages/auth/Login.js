import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate /*, useLocation */ } from "react-router-dom";

//Context
import { useAuth } from "../../context/auth";

export default function Login() {
  //State
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [googleAuthUrl, setGoogleAuthUrl] = useState("");

  //Hooks
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();
  // console.log("location => ", location.state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/auth/login`, {
        email,
        password,
      });
      //console.log(data);
      if (data?.error) {
        console.log(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, token: data.token, user: data.user });
        navigate("/");

        //This is when you get routed back to a login or register from a protected route
        //   navigate(
        //     location.state ||
        //       `/dashboard/${data?.user?.role === 1 ? "admin" : "user"}`
        //   );
      }
    } catch (err) {
      console.log(err);
      //toast.error("Login failed. Try again.");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      console.log("calling google auth...");
      const { data } = await axios.get(`/auth/google`);
      setGoogleAuthUrl(data.google_redirection_url);
    } catch (err) {
      console.log(err);
      //toast.error("Login failed. Try again.");
    }
  };

  if (googleAuthUrl) {
    window.location.href = googleAuthUrl; // Redirect to Google authentication page
  }
  return (
    <>
      {!auth?.user ? (
        <>
          <h1>Login Page</h1>
          <div>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit">Submit</button>
            </form>
            <button onClick={handleGoogleAuth}>Sigin in with Google</button>
          </div>
        </>
      ) : (
        <>
          <Navigate to="/" />
        </>
      )}
    </>
  );
}
