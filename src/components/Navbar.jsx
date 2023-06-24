import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/auth/signup">Sign Up</NavLink>
        </li>
        <li>
          <NavLink to="/auth/profile">My Profile</NavLink>
        </li>
        <li>
          <NavLink to="/auth/budget">Budget</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
