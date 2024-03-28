import { NavLink, Outlet } from "react-router-dom";

const GeoNav = () => {
  return (
    <>
      <ul>
        <li>
          <NavLink to="./">Country</NavLink>
        </li>
        <li>
          <NavLink to="./city">City</NavLink>
        </li>
        <li>
          <NavLink to="./address">Address</NavLink>
        </li>
      </ul>

      <Outlet />
    </>
  );
};

export default GeoNav;
