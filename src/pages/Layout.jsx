import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Layout() {
	return (
		<>
			<header className="container">
				<Navbar />
			</header>
			<main className="container">
				<Outlet />
			</main>
		</>
	)
}

export default Layout
