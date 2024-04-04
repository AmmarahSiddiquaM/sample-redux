import { NavLink, Outlet } from "react-router-dom";

const GeoNav = () => {
  return (
    <>
      <ul>
        <li>
          <NavLink to="./">Inventory</NavLink>
        </li>
        <li>
          <NavLink to="./inventory-rating">Inventory Rating</NavLink>
        </li>
        <li>
          <NavLink to="./inventory-count">Inventory Count</NavLink>
        </li>
        <li>
          <NavLink to="./inventory-unique-count">
            Inventory Unique Count
          </NavLink>
        </li>
        <li>
          <NavLink to="./store">Store</NavLink>
        </li>
        <li>
          <NavLink to="./customer">Customer</NavLink>
        </li>
        <li>
          <NavLink to="./customer-rentals">Customer Rentals</NavLink>
        </li>
        <li>
          <NavLink to="./customer-active-count">Active Customer</NavLink>
        </li>
        <li>
          <NavLink to="./customer-email-count">Email Count</NavLink>
        </li>
        <li>
          <NavLink to="./investor-advisor">Investor & Advisor</NavLink>
        </li>
        <li>
          <NavLink to="./actor-award">Actors & Awards</NavLink>
        </li>
        <li>
          <NavLink to="./payment-average">Payment Average</NavLink>
        </li>
        <li>
          <NavLink to="./replacement-cost">Replacement Cost</NavLink>
        </li>
        <li>
          <NavLink to="./replacement-cost-category">
            Category Replacement Cost
          </NavLink>
        </li>
      </ul>

      <Outlet />
    </>
  );
};

export default GeoNav;
