import "./App.css";
import "./pico.min.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import BudgetOverview from "./pages/BudgetOverview";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/auth/signup" element={<SignupPage />}></Route>
          <Route path="/auth/profile" element={<ProfilePage />}></Route>
          <Route path="/auth/budget" element={<BudgetOverview />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
