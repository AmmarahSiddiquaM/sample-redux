import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate /*, useLocation*/ } from "react-router-dom";

//Context
import { useAuth } from "../../context/auth";

export default function Login() {
  //State
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  //Hooks
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  // const location = useLocation();
  // console.log("location => ", location.state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/auth/register`, {
        name,
        email,
        password,
      });
      console.log(data);
      if (data?.error) {
        console.log(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, token: data.token, user: data.user });
        navigate("/");

        //This is when you get routed back to a login or register from a protected route
        //   navigate(
        //     location.state
        //   );
      }
    } catch (err) {
      console.log(err);
      //toast.error("Login failed. Try again.");
    }
  };
  return (
    <>
      {!auth?.user ? (
        <>
          <h1>Register Page</h1>
          <div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter your name"
                value={email}
                onChange={(e) => setName(e.target.value)}
              />
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
