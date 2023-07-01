import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate, useNavigate } from "react-router-dom";

function PrivatePage({ children }) {
  const navigate = useNavigate();
  const { isLoading, isLoggedIn } = useContext(AuthContext);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isLoggedIn) {
    return <Navigate to="/auth/budget" />;
  } else {
    return <Navigate to="/" />;
  }
}

export default PrivatePage;
