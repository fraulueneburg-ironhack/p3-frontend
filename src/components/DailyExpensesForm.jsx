import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import dailyExpensesGif from '../assets/gif-no-daily-expenses.gif'
import { API_URL } from '../config'

function DailyExpensesForm(props) {
	const navigate = useNavigate()
	const propBudgetData = props.budgetData[0]
	const propDailyExpensesData = props.dailyExpensesData
	const gotToken = localStorage.getItem('authToken')

	// GENERAL FUNCTIONS

	const calculateTotal = (arr) => {
		return arr.reduce((acc, curr) => {
			return acc + curr.amount
		}, 0)
	}

	const writeOutDate = (ISOdate) => {
		return new Date(ISOdate).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		})
	}

	// VARIABLES
	// WEEKLY/MONTHLY BUDGET

	const [timePeriod, setTimePeriod] = useState("week")

	const [monthlyBudget, setMonthlyBudget] = useState(
		calculateTotal(propBudgetData.earnings) - calculateTotal(propBudgetData.expenses)
	)
	const [monthlyBudgetLeft, setMonthlyBudgetLeft] = useState(
		calculateTotal(propBudgetData.earnings) - calculateTotal(propBudgetData.expenses)
	)


	// TIME PERIOD

	let dayToday = new Date().getDay()
	let monthToday = new Date().getMonth()
	let yearToday = new Date().getFullYear()
	console.log('DAY TODAY', dayToday)
	console.log('MONTH TODAY', monthToday)
	console.log('YEAR TODAY', yearToday)

	const [firstDay, setFirstDay] = useState(
		new Date(new Date().setDate(new Date().getDate() + ((-dayToday - 2) % 7)))
	)
	const [lastDay, setLastDay] = useState(
		new Date(new Date().setDate(new Date().getDate() + (((-dayToday - 2) % 7) + 6)))
	)

	const [firstDayISO, setFirstDayISO] = useState(firstDay.toISOString().slice(0, 10))
	const [lastDayISO, setLastDayISO] = useState(lastDay.toISOString().slice(0, 10))

	// today     first    last
	// 0 (sun)   -2       +4         0%6 = 0
	// 1 (mon)   -3       +3         1%6 = 1
	// 2 (tue)   -4       +2         2%6 = 2
	// 3 (wed)   -5       +1         3%6 = 3
	// 4 (thu)   -6       +0         4%6 = 4
	// 5 (fri)   -0       +6         5%6 = 5
	// 6 (sat)   -1       +5         6%6 = 0
	// 0 (sun)   -2       +4         0%6 = 0
	// 1 (mon)   -3       +3         1%6 = 2
	// 2 (tue)   -4       +2         2%6 = 3
	// 3 (wed)   -5       +1
	// 4 (thu)   -6       +0         (-dayToday-2)%7

	// DAILY EXPENSES FOR CURRENT WEEK

	const [dailyExpensesArr, setDailyExpensesArr] = useState(
		propDailyExpensesData.filter(
			(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
		)
	)

	const [dailyExpensesTotal, setdailyExpensesTotal] = useState(calculateTotal(dailyExpensesArr))
	const [budgetTotal, setBudgetTotal] = useState((monthlyBudget / 31) * 7)
	const [budgetLeft, setBudgetLeft] = useState(budgetTotal - dailyExpensesTotal)

	const [numOfWeeksToNavigate, setNumOfWeeksToNavigate] = useState(0)

	useEffect(() => {
		timePeriod === "week" ? setBudgetTotal((monthlyBudget / 31) * 7) : setBudgetTotal(monthlyBudget)
	},[timePeriod, monthlyBudget])

	useEffect(() => {
		// Convert ISO format strings to JavaScript Date objects
		let currentFirstDay = new Date(firstDay)
		let currentLastDay = new Date(lastDay)
		const oneWeek = 7 * 24 * 60 * 60 * 1000 // One week in milliseconds

		// Calculate the new firstDayOfTheWeek and lastDayOfTheWeek based on the current state
		let newFirstDay = new Date(currentFirstDay.getTime() + numOfWeeksToNavigate * oneWeek)
		let newLastDay = new Date(currentLastDay.getTime() + numOfWeeksToNavigate * oneWeek)
		
		if (timePeriod === "month") {
			currentFirstDay = new Date(yearToday, monthToday, 1)
			currentLastDay = new Date(yearToday, monthToday + 1, 0)

			newFirstDay = new Date(currentFirstDay.setMonth(currentFirstDay.getMonth() + numOfWeeksToNavigate))
			newLastDay = new Date(currentLastDay.setMonth(currentLastDay.getMonth() + numOfWeeksToNavigate))
		}

		// Convert back to ISO format strings
		// Update the state with the new ISO format strings
		const newFirstDayISO = newFirstDay.toISOString().slice(0, 10)
		const newLastDayISO = newLastDay.toISOString().slice(0, 10)

		setFirstDayISO(newFirstDayISO)
		setLastDayISO(newLastDayISO)

		setDailyExpensesArr(
			propDailyExpensesData.filter(
				(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
			)
		)
	}, [firstDay, lastDay, firstDayISO, lastDayISO, numOfWeeksToNavigate, timePeriod, monthToday, yearToday, propDailyExpensesData])

	useEffect(() => {
		setdailyExpensesTotal(calculateTotal(dailyExpensesArr))
		setBudgetLeft(budgetTotal - calculateTotal(dailyExpensesArr))
	}, [dailyExpensesArr, budgetTotal])

	// ADD EXPENSE

	const handleAddDailyExpense = async (event) => {
		event.preventDefault()

		const newDailyExpense = {
			date: event.target.date.value,
			category: event.target.category.value,
			name: event.target.name.value,
			amount: +event.target.amount.value,
		}

		try {
			await axios.post(`${API_URL}/budget/addexpense`, newDailyExpense, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			navigate('/budget')
		} catch (err) {
			console.log('THIS IS THE ADD EXPENSE ERR', err)
		}

		setDailyExpensesArr(
			[newDailyExpense, ...dailyExpensesArr].sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0))
		)
		setdailyExpensesTotal(calculateTotal([newDailyExpense, ...dailyExpensesArr]))
		setBudgetLeft(budgetTotal - calculateTotal([newDailyExpense, ...dailyExpensesArr]))
	}

	// DELETE EXPENSE

	const handleDeleteDailyExpense = async (index, event) => {
		event.preventDefault()
		const filteredDailyExpensesArr = dailyExpensesArr.filter((elem, i) => {
			if (i !== index) return elem
		})
		setDailyExpensesArr(filteredDailyExpensesArr)

		const expenseId = event.target.getAttribute('data-key')

		try {
			await axios.delete(`${API_URL}/budget/deleteexpense/${expenseId}`, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			navigate('/budget')
		} catch (err) {
			console.log('THIS IS THE ERR', err)
		}

		setdailyExpensesTotal(calculateTotal(filteredDailyExpensesArr))
		setBudgetLeft(budgetTotal - calculateTotal(filteredDailyExpensesArr))
	}

	return (
		<>
			<div className="grid">
				<button onClick={() => setTimePeriod("week")}>weekly</button>
				<button onClick={() => setTimePeriod("month")}>monthly</button>
			</div>
			<div className="card">
				<small>
					<mark>current {timePeriod}</mark>
					<div>
						{writeOutDate(firstDayISO)} – {writeOutDate(lastDayISO)}
					</div>
				</small>
				<h1>Budget left this {timePeriod}:</h1>
				<big>
					{budgetLeft.toFixed(2)} {propBudgetData.currency}
				</big>
				of {budgetTotal.toFixed(2)} {propBudgetData.currency}
				<br />
				<br />
				
				<div className="grid">
					<button onClick={() => setNumOfWeeksToNavigate((prev) => prev - 1)}>« prev {timePeriod}</button>
					<button onClick={() => setNumOfWeeksToNavigate((prev) => prev + 1)}>» next {timePeriod}</button>
				</div>
			</div>
			<h2>Add an expense:</h2>
			<form onSubmit={handleAddDailyExpense} className="form-daily-expenses">
				<div className="grid">
					<input type="date" name="date" min={firstDayISO} max={lastDayISO} required></input>
					<select name="category">
						{propBudgetData.spendingCategories.map((elem, index) => {
							return <option key={elem + '-' + index}>{elem}</option>
						})}
					</select>
					<input type="text" name="name" placeholder="name"></input>
					<input type="number" name="amount" placeholder="0,00" step=".01" required></input>
					<button className="btn-add-item">+</button>
				</div>
			</form>
			<div className="card">
				{dailyExpensesArr.length <= 0 ? (
					<div className="card-empty-text">
						<h4>No expenses yet.</h4>
						<p>Start adding some via the form above.</p>
						<img src={dailyExpensesGif} alt="" width="300" />
					</div>
				) : (
					<table className="table-daily-expenses">
						<thead>
							<tr>
								<th style={{ width: '130px' }}>Date</th>
								<th>Category</th>
								<th>Name</th>
								<th style={{ textAlign: 'right' }}>Amount</th>
								<th>delete</th>
							</tr>
						</thead>
						<tbody>
							{dailyExpensesArr
								.map((dailyExpense, index) => {
									return (
										<tr key={dailyExpense._id}>
											<td style={{ width: '130px' }}>
												<time dateTime={dailyExpense.date}>{writeOutDate(dailyExpense.date)}</time>
											</td>
											<td>
												<strong>{dailyExpense.category}</strong>
											</td>
											<td>{dailyExpense.name}</td>
											<td style={{ textAlign: 'right' }}>
												-{dailyExpense.amount.toFixed(2)} {propBudgetData.currency}
											</td>
											<td>
												<button
													data-key={dailyExpense._id}
													className="btn-delete-item"
													onClick={(event) => handleDeleteDailyExpense(index, event)}>
													–
												</button>
											</td>
										</tr>
									)
								})
								.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0))}
						</tbody>
						<tfoot>
							<tr>
								<td></td>
								<td></td>
								<td></td>
								<td style={{textAlign: 'right'}}>
									<strong>-{(budgetTotal - budgetLeft).toFixed(2)}  {propBudgetData.currency}</strong>
								</td>
							</tr>
						</tfoot>
					</table>
				)}
			</div>
		</>
	)
}

export default DailyExpensesForm
