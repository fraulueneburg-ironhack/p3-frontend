import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";

function Layout() {
  const { logOutUser } = useContext(AuthContext);
  return (
    <>
      <header className="container">
        <Navbar />
        <button onClick={logOutUser}>Logout </button>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
