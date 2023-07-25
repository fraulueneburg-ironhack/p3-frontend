import { useEffect, useState } from 'react'
import DailyExpensesForm from '../components/DailyExpensesForm'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { API_URL } from '../config'

function BudgetOverview() {
	const [existingBudget, setExistingBudget] = useState([])
	const [dataLoaded, setDataLoaded] = useState(false)
	const [existingDailyExpenses, setExistingDailyExpenses] = useState([])

	useEffect(() => {
		const gotToken = localStorage.getItem('authToken')
		const fetchBudgetData = async () => {
			try {
				const resp = await axios.get(`${API_URL}/budget`, {
					headers: { authorization: `Bearer ${gotToken}` },
				})
				setExistingDailyExpenses(resp.data.respDailyExpenses)
				setExistingBudget(resp.data.respMonthlyBudget)
				setDataLoaded(true)
			} catch (err) {
				console.log('catch block error:', err)
			}
		}
		fetchBudgetData()
		setDataLoaded(true)
	}, [])

	if (dataLoaded && existingBudget.length > 0) {
		return (
			<>
				<h1>Your Budget</h1>
				<DailyExpensesForm budgetData={existingBudget} dailyExpensesData={existingDailyExpenses} />
			</>
		)
	} else if (dataLoaded && existingBudget.length === 0) {
		return (
			<>
				<h1>You don’t have a budget yet</h1>
				<Link to="/budget/settings">Set up your budget now</Link>
			</>
		)
	}
}

export default BudgetOverview
