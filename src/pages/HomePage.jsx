import LoginForm from '../components/LoginForm'
import cuteDog from '../assets/cute-dog.jpg'

function HomePage() {
	return (
		<>
			<h1>Welcome to Sparsam</h1>
			<h2>The awesome web app with a cute dog on its cover</h2>
			<div className="columns">
				<div className="column">
					<img src={cuteDog} alt="" />
				</div>
				<div className="column">
					<LoginForm />
				</div>
			</div>
		</>
	)
}

export default HomePage
