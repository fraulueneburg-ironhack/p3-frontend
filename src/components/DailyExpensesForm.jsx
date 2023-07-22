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
		let writtenDate
		if (+ISOdate.slice(0, 4) === yearToday) {
			writtenDate = new Date(ISOdate).toLocaleDateString('en-US', {
				weekday: 'short',
				month: 'short',
				day: 'numeric',
			})
		} else {
			writtenDate = new Date(ISOdate).toLocaleDateString('en-US', {
				year: 'numeric',
				weekday: 'short',
				month: 'short',
				day: 'numeric',
			})
		}
		return writtenDate
	}

	// VARIABLES
	// WEEKLY/MONTHLY BUDGET

	const [timePeriod, setTimePeriod] = useState('week')

	const [monthlyBudget, setMonthlyBudget] = useState(
		calculateTotal(propBudgetData.earnings) - calculateTotal(propBudgetData.expenses)
	)

	// TIME PERIOD

	const dayToday = new Date().getDay()
	const monthToday = new Date().getMonth()
	const yearToday = new Date().getFullYear()

	const [isCurrentTime, setIsCurrentTime] = useState(true)

	const [firstDay, setFirstDay] = useState(new Date(new Date().setDate(new Date().getDate() + ((-dayToday - 2) % 7))))
	const [lastDay, setLastDay] = useState(new Date(new Date().setDate(new Date().getDate() + (((-dayToday - 2) % 7) + 6))))

	const [firstDayISO, setFirstDayISO] = useState(firstDay.toISOString().slice(0, 10))
	const [lastDayISO, setLastDayISO] = useState(lastDay.toISOString().slice(0, 10))

	// DAILY EXPENSES FOR CURRENT WEEK

	const [dailyExpensesArr, setDailyExpensesArr] = useState(
		propDailyExpensesData.filter(
			(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
		)
	)

	const [dailyExpensesTotal, setdailyExpensesTotal] = useState(calculateTotal(dailyExpensesArr))
	const [budgetTotal, setBudgetTotal] = useState((monthlyBudget / 31) * 7)
	const [budgetLeft, setBudgetLeft] = useState(budgetTotal - dailyExpensesTotal)

	const [numOfItemsToNavigate, setNumOfItemsToNavigate] = useState(0)

	useEffect(() => {
		setNumOfItemsToNavigate(0)
		timePeriod === 'week' ? setBudgetTotal((monthlyBudget / 31) * 7) : setBudgetTotal(monthlyBudget)
	}, [timePeriod, monthlyBudget])

	useEffect(() => {
		console.log('INITIAL numOfItemsToNavigate', numOfItemsToNavigate)
		// Convert ISO format strings to JavaScript Date objects
		let currentFirstDay = new Date(firstDay)
		let currentLastDay = new Date(lastDay)
		const oneWeek = 7 * 24 * 60 * 60 * 1000 // One week in milliseconds

		// Calculate the new firstDayOfTheWeek and lastDayOfTheWeek based on the current state
		let newFirstDay = new Date(currentFirstDay.getTime() + numOfItemsToNavigate * oneWeek)
		let newLastDay = new Date(currentLastDay.getTime() + numOfItemsToNavigate * oneWeek)

		if (timePeriod === 'month') {
			const newDate = new Date()
			const timezoneOffsetHours = Math.floor(Math.abs(newDate.getTimezoneOffset()) / 60)
			newFirstDay = new Date(yearToday, monthToday + numOfItemsToNavigate, 1, timezoneOffsetHours)
			newLastDay = new Date(yearToday, monthToday + numOfItemsToNavigate + 1, 0, timezoneOffsetHours)
		}

		console.log('AFTER numOfItemsToNavigate', numOfItemsToNavigate)

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

		setIsCurrentTime(
			(timePeriod === 'month' && yearToday === +lastDayISO.slice(0, 4) && monthToday + 1 === +lastDayISO.slice(5, 7)) ||
				(timePeriod === 'week' && new Date().toISOString() >= firstDayISO && new Date().toISOString() <= lastDayISO)
				? true
				: false
		)
	}, [
		firstDay,
		lastDay,
		firstDayISO,
		lastDayISO,
		numOfItemsToNavigate,
		timePeriod,
		monthToday,
		yearToday,
		propDailyExpensesData,
	])

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
			<div className={`card card-budget ${timePeriod}-active`}>
				<div className="nav-tabs">
					<button onClick={() => setTimePeriod('week')} className={`btn-week ${timePeriod === 'week' ? 'active' : ''}`}>
						week view
					</button>
					<button onClick={() => setTimePeriod('month')} className={`btn-month ${timePeriod === 'month' ? 'active' : ''}`}>
						month view
					</button>
				</div>
				<small>
					{isCurrentTime ? <mark>current {timePeriod}</mark> : null}
					<div>
						<time dateTime={firstDayISO}>{writeOutDate(firstDayISO)}</time>
						{' – '}
						<time dateTime={lastDayISO}>{writeOutDate(lastDayISO)}</time>
					</div>
				</small>
				<h1>Budget left this {timePeriod}:</h1>
				<p>
					<big className={`${budgetLeft < 0 ? 'is-negative' : null}`}>
						{budgetLeft.toFixed(2)} {propBudgetData.currency}
					</big>
					of {budgetTotal.toFixed(2)} {propBudgetData.currency}
				</p>
				<div className="btn-group nav-prev-next">
					<button onClick={() => setNumOfItemsToNavigate((prev) => prev - 1)} aria-label={`go to previous ${timePeriod}`}>
						«
					</button>
					<button
						onClick={() => setNumOfItemsToNavigate((prev) => prev + 1)}
						aria-label={`go to next ${timePeriod}`}
						disabled={isCurrentTime}>
						»
					</button>
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
				</div>
				<div className="grid">
					<input type="text" name="name" placeholder="name"></input>
					<div className="input-group">
						<span className="input-group-text">-</span>
						<input type="number" name="amount" placeholder="0,00" step=".01" required></input>
						<span className="text">€</span>
						<button className="btn-add-item">+</button>
					</div>
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
								.sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0))
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
								})}
						</tbody>
						<tfoot>
							<tr>
								<td></td>
								<td></td>
								<td></td>
								<td>
									-{(budgetTotal - budgetLeft).toFixed(2)} {propBudgetData.currency}
									<br />
									Left: {budgetLeft.toFixed(2)} {propBudgetData.currency}
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
