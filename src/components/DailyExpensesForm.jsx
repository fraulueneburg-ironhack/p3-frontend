import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import dailyExpensesGif from '../assets/gif-no-daily-expenses.gif'

const gotToken = localStorage.getItem('authToken')

function DailyExpensesForm(props) {
	const navigate = useNavigate()
	const propBudgetData = props.budgetData[0]
	const propDailyExpensesData = props.dailyExpensesData

	// GENERAL FUNCTIONS

	const calculateTotal = (arr) => {
		return arr.reduce((acc, curr) => {
			return acc + curr.amount
		}, 0)
	}

	const writeOutDay = (day) => {
		return day.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		})
	}

	// VARIABLES

	const [monthlyBudget, setMonthlyBudget] = useState(
		calculateTotal(propBudgetData.earnings) - calculateTotal(propBudgetData.expenses)
	)
	const [weeklyBudgetTotal, setWeeklyBudgetTotal] = useState((monthlyBudget / 31 / 7).toFixed(2))
	const [weeklyBudgetLeft, setWeeklyBudgetLeft] = useState((monthlyBudget / 31 / 7).toFixed(2))

	const dateToday = new Date().toISOString()

	const weekdayToday = 4
	const firstDayOfWeek = writeOutDay(new Date(new Date().setDate(new Date().getDate() - 6)))
	const lastDayOfWeek = writeOutDay(new Date(new Date().setDate(new Date().getDate() - 0)))

	// today: 4 (last day)
	// first day: 5
	// last day: 4

	// td  fd  ld
	//  0  2   3
	//  1  3   4
	//  2  4   5
	//  3  5   6
	//  4  6   0
	//  5  0   1
	//  6  1   2

	// 0-6
	// friday = 5
	// thursday = 4

	// console.log('Date to string', new Date().toLocaleDateString('en-US'))
	// console.log('currentDate', dateToday)
	// console.log('weekdayToday', weekdayToday)
	// console.log('firstDayOfWeek', firstDayOfWeek)
	// console.log('lastDayOfWeek', lastDayOfWeek)
	// console.log('monthlyBudget', monthlyBudget)
	// console.log('weeklyBudget', weeklyBudgetTotal)

	// DAILY EXPENSES

	const [dailyExpensesArr, setDailyExpensesArr] = useState(propDailyExpensesData)
	const [dailyExpensesTotal, setdailyExpensesTotal] = useState(calculateTotal(dailyExpensesArr))
	console.log('dailyExpensesTotal', dailyExpensesTotal)

	// ADD EXPENSE

	const handleAddDailyExpense = async (event) => {
		event.preventDefault()

		const newDailyExpense = {
			date: event.target.date.value,
			category: event.target.category.value,
			name: event.target.name.value,
			amount: event.target.amount.value,
		}

		console.log('newDailyExpense', newDailyExpense)

		try {
			await axios.post('http://localhost:5005/budget/addexpense', newDailyExpense, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			navigate('/budget')
		} catch (err) {
			console.log('THIS IS THE ERR', err)
		}

		setDailyExpensesArr([newDailyExpense, ...dailyExpensesArr])
		setdailyExpensesTotal(calculateTotal([newDailyExpense, ...dailyExpensesArr]))
		setWeeklyBudgetLeft(weeklyBudgetTotal - calculateTotal([newDailyExpense, ...dailyExpensesArr]))
	}

	// DELETE EXPENSE

	const handleDeleteDailyExpense = (index, event) => {
		event.preventDefault()
		const filteredDailyExpensesArr = dailyExpensesArr.filter((elem, i) => {
			if (i !== index) return elem
		})
		setDailyExpensesArr(filteredDailyExpensesArr)
	}

	return (
		<>
			<div className="card">
				<small>
					<mark>current week</mark>
					<br />
					{firstDayOfWeek} – {lastDayOfWeek}
				</small>
				<h1>Your Budget this week:</h1>
				<big>
					{weeklyBudgetLeft} {propBudgetData.currency}
				</big>
				of {weeklyBudgetTotal} {propBudgetData.currency}
				<br />
				<br />
				<div className="grid">
					<button>« prev week</button>
					<button>» next week</button>
				</div>
			</div>
			<h2>Add an expense from today:</h2>
			<form onSubmit={handleAddDailyExpense} className="form-daily-expenses">
				<div className="grid">
					<input type="date" name="date" required></input>
					<select name="category">
						<option>Food</option>
						<option>Hobbies</option>
						<option>Party</option>
					</select>
					<input type="text" name="name" placeholder="name"></input>
					<input type="number" name="amount" placeholder="0,00" required></input>
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
							{dailyExpensesArr.map((dailyExpense, index) => {
								return (
									<tr key={dailyExpense._id}>
										<td style={{ width: '130px' }}>
											<time dateTime={dailyExpense.date}>{dailyExpense.date.slice(0, 10)}</time>
										</td>
										<td>
											<strong>{dailyExpense.category}</strong>
										</td>
										<td>{dailyExpense.name}</td>
										<td style={{ textAlign: 'right' }}>
											-{dailyExpense.amount} {propBudgetData.currency}
										</td>
										<td>
											<button className="btn-delete-item" onClick={(event) => handleDeleteDailyExpense(index, event)}>
												–
											</button>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				)}
			</div>
		</>
	)
}

export default DailyExpensesForm
