import { useEffect, useState } from 'react'
import BudgetForm from '../components/BudgetForm'
import DailyExpensesForm from '../components/DailyExpensesForm'
import axios from 'axios'
import iconSettings from '../assets/icon-settings.svg'

function BudgetOverview() {
	const [existingBudget, setExistingBudget] = useState([])
	const [dataLoaded, setDataLoaded] = useState(false)
	const [budgetEditMode, setBudgetEditMode] = useState(false)
	const [existingDailyExpenses, setExistingDailyExpenses] = useState([])

	const handleBudgetEditMode = () => {
		setBudgetEditMode(true)
	}

	useEffect(() => {
		const gotToken = localStorage.getItem('authToken')
		const fetchBudgetData = async () => {
			try {
				const resp = await axios.get('http://localhost:5005/budget', {
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
	}, [])

	if (dataLoaded && existingBudget.length > 0) {
		return (
			<>
				<button style={{ width: '60px', padding: '10px', float: 'right' }}>
					<img src={iconSettings} alt="settings" />
				</button>
				<DailyExpensesForm budgetData={existingBudget} dailyExpensesData={existingDailyExpenses} />
			</>
		)
	} else if (dataLoaded && existingBudget.length === 0) {
		return (
			<>
				<h1>Your budget:</h1>
				<p>
					You don’t have a weekly budget yet. Start setting up your account by adding your monthly earnings, expenses and
					spending categories here:
				</p>
				<BudgetForm budgetData={existingBudget} />
			</>
		)
	}
}

export default BudgetOverview
