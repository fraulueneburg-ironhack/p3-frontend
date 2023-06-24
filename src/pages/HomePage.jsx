import LoginForm from "../components/LoginForm";
import cuteDog from "../assets/cute-dog.jpg";

function HomePage() {
  return (
    <div>
      <h1>Welcome to Sparsam</h1>
      <div className="grid">
        <p>Some intro paragraph goes here</p>
        <img src={cuteDog} alt="" />
      </div>
      <LoginForm />
    </div>
  );
}

export default HomePage;
