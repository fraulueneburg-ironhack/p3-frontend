import { useEffect, useState } from 'react'
import BudgetForm from '../components/BudgetForm'
import axios from 'axios'

function BudgetSettings() {
	const [existingBudget, setExistingBudget] = useState([])
	const [dataLoaded, setDataLoaded] = useState(false)

	useEffect(() => {
		const gotToken = localStorage.getItem('authToken')
		const fetchBudgetData = async () => {
			try {
				const resp = await axios.get('http://localhost:5005/budget/settings', {
					headers: { authorization: `Bearer ${gotToken}` },
				})
				setExistingBudget(resp.data.respMonthlyBudget)
				setDataLoaded(true)
			} catch (err) {
				console.log('catch block error:', err)
			}
		}
		fetchBudgetData()
		setDataLoaded(true)
	}, [])

	if (dataLoaded) {
		return (
			<>
				<h1>Your budget:</h1>
				<p>Add your monthly earnings, expenses and spending categories here:</p>
				<BudgetForm budgetData={existingBudget} />
			</>
		)
	} else {
		return 'blablabla'
	}
}

export default BudgetSettings
