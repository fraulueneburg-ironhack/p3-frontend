import axios from 'axios'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'

function LoginForm() {
	const [emailInput, setEmailInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')
	const navigate = useNavigate()
	const { setToken, authenticateUser, setIsLoggedIn } = useContext(AuthContext)

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const { data } = await axios.post('http://localhost:5005/auth/login', {
				email: emailInput,
				password: passwordInput,
			})

			const actualToken = data.authToken
			setToken(actualToken)
			authenticateUser()
			setIsLoggedIn(true)
			setEmailInput('')
			setPasswordInput('')
			navigate('/budget')
		} catch (err) {
			console.log('im in the catch block')
			console.log('this is the err', err)
			setEmailInput('')
			setPasswordInput('')
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					name="email"
					autoComplete="email"
					value={emailInput}
					placeholder="Email"
					onChange={(e) => setEmailInput(e.target.value)}
				/>
				<input
					type="password"
					name="password"
					autoComplete="password"
					value={passwordInput}
					placeholder="*********"
					onChange={(e) => setPasswordInput(e.target.value)}
				/>
				<input type="submit" value="Login" />
			</form>
		</div>
	)
}

export default LoginForm
