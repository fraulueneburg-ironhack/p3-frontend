import './css/pico.min.css'
import './css/grid.css'
import './css/App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import BudgetOverview from './pages/BudgetOverview'
import BudgetSettings from './pages/BudgetSettings'
import PrivatePage from './pages/PrivatePage'

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<HomePage />}></Route>
					<Route path="/auth/signup" element={<SignupPage />}></Route>
					<Route
						path="/auth/profile"
						element={
							<PrivatePage>
								<ProfilePage />
							</PrivatePage>
						}
					/>
					<Route
						path="/budget"
						element={
							<PrivatePage>
								<BudgetOverview />
							</PrivatePage>
						}
					/>
					<Route
						path="/budget/settings"
						element={
							<PrivatePage>
								<BudgetSettings />
							</PrivatePage>
						}
					/>
				</Route>
			</Routes>
		</div>
	)
}

export default App
