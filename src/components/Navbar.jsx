import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const { logOutUser, isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <nav>
        {isLoggedIn ?
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/profile">My Profile</NavLink></li>
            <li><NavLink to="/budget">Budget</NavLink></li>
            <li><NavLink to="/saving-goals">Saving Goals</NavLink></li>
          </ul>
          :
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/auth/signup">Sign Up</NavLink></li>
          </ul>
        }
      </nav>
      {isLoggedIn ? <button onClick={logOutUser}>Logout</button> : null}
    </>
  );
}

export default Navbar;
