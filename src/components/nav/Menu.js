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
              <NavLink to="/actor">Actor</NavLink>
            </li>
            <li>
              <NavLink to="/film">Film</NavLink>
            </li>
            <li>
              <NavLink to="/inventory">Inventory</NavLink>
            </li>
            <li>
              <NavLink to="/advisor">Advisor</NavLink>
            </li>
            <li>
              <NavLink to="/investor">Investor</NavLink>
            </li>
            <li>
              <NavLink to="/customer">Customer</NavLink>
            </li>
            <li>
              <NavLink to="/category">Category</NavLink>
            </li>
            <li>
              <NavLink to="/language">Language</NavLink>
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
