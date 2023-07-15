import { useEffect, useState } from 'react'
import BudgetForm from '../components/BudgetForm'
import DailyExpensesForm from '../components/DailyExpensesForm'
import axios from 'axios'
import iconSettings from '../assets/icon-settings.svg'

function BudgetOverview() {
	const [existingBudget, setExistingBudget] = useState([])
	const [existingBudgetLoaded, setExistingBudgetLoaded] = useState(false)
	const [existingDailyExpenses, setExistingDailyExpenses] = useState([])

	useEffect(() => {
		const gotToken = localStorage.getItem('authToken')
		const fetchBudgetData = async () => {
			try {
				const resp = await axios.get('http://localhost:5005/budget', {
					headers: { authorization: `Bearer ${gotToken}` },
					body: { token: gotToken },
				})
				console.log('RESP', resp)
				setExistingDailyExpenses(resp.data.respDailyExpenses)
				setExistingBudget(resp.data.respMonthlyBudget)
			} catch (err) {
				console.log('catch block error:', err)
			}
		}
		fetchBudgetData()
		setExistingBudgetLoaded(true)
	}, [])

	if (existingBudgetLoaded && existingBudget.length > 0) {
		return (
			<>
				<button style={{ width: '60px', padding: '10px', float: 'right' }}>
					<img src={iconSettings} alt="settings" />
				</button>
				<DailyExpensesForm budgetData={existingBudget} dailyExpensesData={existingDailyExpenses} />
			</>
		)
	} else if (!existingBudgetLoaded && existingBudget.length > 0) {
		return (
			<>
				<h1>Edit your budget:</h1>
				<p>
					You don’t have a weekly budget yet. Start setting up your account by adding your monthly earnings, expenses and
					spending categories here:
				</p>
				<BudgetForm budgetData={existingBudget} />
			</>
		)
	} else if (existingBudgetLoaded && existingBudget.length === 0) {
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
	} else {
		return <>••• loading •••</>
	}
}

export default BudgetOverview
