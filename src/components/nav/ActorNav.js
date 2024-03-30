import { NavLink, Outlet } from "react-router-dom";

const ActorNav = () => {
  return (
    <>
      <ul>
        <li>
          <NavLink to="./">Actor</NavLink>
        </li>
        {/* <li>
          <NavLink to="./award">Actor Award</NavLink>
        </li> */}
      </ul>

      <Outlet />
    </>
  );
};

export default ActorNav;
