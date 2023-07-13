import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const navigate = useNavigate();

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
      setNameInput("");
      setEmailInput("");
      setPasswordInput("");
      navigate("/budget");
    } catch (err) {
      console.log("im in the catch block");
      console.log("THIS IS THE ERR", err);
      setNameInput("");
      setEmailInput("");
      setPasswordInput("");
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
        <input type="submit" value="Edit" />
      </form>
    </>
  );
}

export default ProfilePage;
