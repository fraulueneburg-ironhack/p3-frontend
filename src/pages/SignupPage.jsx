import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const create = await axios.post("http://localhost:5005/auth/signup", {
        name: nameInput,
        email: emailInput,
        password: passwordInput,
      });
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
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={nameInput}
          placeholder="Name"
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
        <input type="submit" value="Login" />
      </form>
    </>
  );
}

export default SignupPage;
