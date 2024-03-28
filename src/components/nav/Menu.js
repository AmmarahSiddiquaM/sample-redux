import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Menu = () => {
  const navigate = useNavigate();

  const [auth, setAuth] = useAuth();

  const logout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        {!auth?.user ? (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/geo">Geo</NavLink>
            </li>
            <li>
              <a onClick={logout}>Logout</a>
            </li>
          </>
        )}
      </ul>
    </>
  );
};

export default Menu;
