import { AuthContext } from '../context/auth.context'
import { useContext, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'

function Navbar() {
	const { logOutUser, isLoggedIn } = useContext(AuthContext)
	const navRef = useRef()
	const showNavbar = () => {
		console.log(navRef.current.classList)

		navRef.current.classList.toggle('active')
		console.log(navRef.current.classList)
	}

	return (
		<>
			<button className="btn-toggle-menu" onClick={showNavbar}>
				<FaBars />
			</button>
			<nav className="nav_main" ref={navRef}>
				{isLoggedIn ? (
					<ul>
						<li>
							<NavLink onClick={showNavbar} to="/" {...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								Home
							</NavLink>
						</li>
						<li>
							<NavLink
								onClick={showNavbar}
								to="/auth/profile"
								end
								{...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								My Profile
							</NavLink>
						</li>
						<li>
							<NavLink
								onClick={showNavbar}
								to="/budget/settings"
								end
								{...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								Settings
							</NavLink>
						</li>
						<li>
							<NavLink
								onClick={showNavbar}
								to="/budget"
								end
								{...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								Budget
							</NavLink>
						</li>
						{isLoggedIn ? (
							<li className="last">
								<button onClick={logOutUser}>Logout</button>
							</li>
						) : null}
					</ul>
				) : (
					<ul>
						<li>
							<NavLink onClick={showNavbar} to="/">
								Home
							</NavLink>
						</li>
						<li>
							<NavLink onClick={showNavbar} to="/auth/signup">
								Sign Up
							</NavLink>
						</li>
					</ul>
				)}
			</nav>
		</>
	)
}

export default Navbar
