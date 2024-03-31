import { NavLink, Outlet } from "react-router-dom";

const FilmNav = () => {
  return (
    <>
      <ul>
        <li>
          <NavLink to="./">Film</NavLink>
        </li>
        {/* <li>
          <NavLink to="./award">Actor Award</NavLink>
        </li> */}
      </ul>

      <Outlet />
    </>
  );
};

export default FilmNav;
