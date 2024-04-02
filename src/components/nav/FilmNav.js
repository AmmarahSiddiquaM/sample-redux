import { NavLink, Outlet } from "react-router-dom";

const FilmNav = () => {
  return (
    <>
      <ul>
        <li>
          <NavLink to="./">Film</NavLink>
        </li>
        <li>
          <NavLink to="./actor">Film actor</NavLink>
        </li>
        <li>
          <NavLink to="./category">Film category</NavLink>
        </li>
      </ul>

      <Outlet />
    </>
  );
};

export default FilmNav;
