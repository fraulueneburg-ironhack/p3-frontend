import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const create = await axios.post("http://localhost:3000/api/users", {
        emailInput,
        passwordInput,
      });
      setEmailInput("");
      setPasswordInput("");
      navigate("/auth/profile");
      console.log(create);
    } catch (err) {
      console.log("im in the catch block", emailInput);
      setEmailInput("");
      setPasswordInput("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
}

export default LoginForm;
