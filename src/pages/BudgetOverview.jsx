import { useEffect, useState } from 'react'
import BudgetForm from '../components/BudgetForm'
import DailyExpensesForm from '../components/DailyExpensesForm'
import axios from 'axios'

const gotToken = localStorage.getItem('authToken')

function BudgetOverview() {
	const [existingBudget, setExistingBudget] = useState([])
	const [existingBudgetLoaded, setExistingBudgetLoaded] = useState(false)
	const [existingDailyExpenses, setExistingDailyExpenses] = useState(false)

	useEffect(() => {
		const fetchBudgetData = async () => {
			try {
				const resp = await axios.get('http://localhost:5005/budget', {
					headers: { authorization: `Bearer ${gotToken}` },
					body: { token: gotToken },
				})
				console.log('RESP', resp)
				setExistingBudget(resp.data.respMonthlyBudget)
				setExistingDailyExpenses(resp.data.respDailyExpenses)
				setExistingBudgetLoaded(true)
			} catch (err) {
				console.log('catch block error:', err)
			}
		}
		fetchBudgetData()
	}, [])

	if (existingBudgetLoaded && existingBudget.length > 0) {
		return (
			<>
				<DailyExpensesForm budgetData={existingBudget} dailyExpensesData={existingDailyExpenses} />
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
		return <>loading</>
	}
}

export default BudgetOverview
