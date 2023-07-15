import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function ProfilePage() {
  const [nameInput, setNameInput] = useState();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const { setToken, setIsLoggedIn, logOutUser } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const gotToken = localStorage.getItem("authToken");
        const resp = await axios.get("http://localhost:5005/auth/profile", {
          headers: { authorization: `Bearer ${gotToken}` },
        });

        setNameInput(resp.data.userNeeded.name);
        setEmailInput(resp.data.userNeeded.email);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gotToken = localStorage.getItem("authToken");
    try {
      const edit = await axios.post(
        "http://localhost:5005/auth/profile",
        {
          name: nameInput,
          email: emailInput,
          password: passwordInput,
        },
        { headers: { authorization: `Bearer ${gotToken}` } }
      );
      console.log(edit.data.updatedUser.email);
      setNameInput(edit.data.updatedUser.name);
      setEmailInput(edit.data.updatedUser.email);
      setPasswordInput("");
    } catch (err) {
      console.log("im in the catch block");
      console.log("THIS IS THE ERR", err);
      setNameInput("");
      setEmailInput("");
      setPasswordInput("");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const gotToken = localStorage.getItem("authToken");

    try {
      await axios.delete(
        "http://localhost:5005/auth/profile/delete",

        {
          headers: { authorization: `Bearer ${gotToken}` },
        }
      );

      logOutUser();
      navigate("/");
    } catch (err) {
      console.log("DELETE USER ERROR", err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Edit Profile details</h1>
        <input
          type="text"
          name="name"
          value={nameInput}
          placeholder="Edit Name"
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          type="email"
          name="email"
          value={emailInput}
          placeholder="Email"
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <input
          type="password"
          name="password"
          value={passwordInput}
          placeholder="*********"
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <input type="submit" value="SAVE" />
      </form>

      <button className="btn-delete-item" type="submit" onClick={handleDelete}>
        DELETE
      </button>
    </>
  );
}

export default ProfilePage;
