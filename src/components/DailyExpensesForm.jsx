import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import dailyExpensesGif from '../assets/gif-no-daily-expenses.gif'

function DailyExpensesForm(props) {
	const navigate = useNavigate()
	const propBudgetData = props.budgetData[0]
	const propDailyExpensesData = props.dailyExpensesData
	const gotToken = localStorage.getItem('authToken')
	const weekdaysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
	console.log('monthlyBudget', monthlyBudget)

	// DAILY EXPENSES

	const [dailyExpensesArr, setDailyExpensesArr] = useState(propDailyExpensesData)
	console.log(dailyExpensesArr)
	console.log('DATE', dailyExpensesArr[0].date)
	console.log('DATE TYPEOF', typeof dailyExpensesArr[0].date)

	const [dailyExpensesTotal, setdailyExpensesTotal] = useState(calculateTotal(dailyExpensesArr))
	const [weeklyBudgetTotal, setWeeklyBudgetTotal] = useState((monthlyBudget / 31) * 7)

	const [weeklyBudgetLeft, setWeeklyBudgetLeft] = useState(weeklyBudgetTotal - dailyExpensesTotal)
	console.log('weeklyBudgetLeft', weeklyBudgetLeft)

	const dateToday = new Date().toISOString()

	const weekdayToday = 6
	const firstDayOfWeek = writeOutDay(new Date(new Date().setDate(new Date().getDate() - 1)))
	const lastDayOfWeek = writeOutDay(new Date(new Date().setDate(new Date().getDate() + 5)))

	// 4 (thu, day 6)
	// first day: -6
	// last day: +-0

	// 5 (fri, day 0)
	// first day: 0
	// last day: +6

	// today: 6 (SATURDAY, day 1)
	// first day: -1
	// last day: +5

	// 0 (sun, day 2)
	// first day: -2
	// last day: +4

	// 1 (mon, day 3)
	// first day: -3
	// last day: +3

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

	// TIME PERIOD

	const firstDayThisWeek = new Date(new Date().setDate(new Date().getDate()))
	const lastDayThisWeek = new Date(new Date().setDate(new Date().getDate() - 7))

	console.log('FIRST DAY', firstDayThisWeek.toISOString())
	console.log('LAST DAY', lastDayThisWeek.toISOString())

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
			await axios.post('http://localhost:5005/budget/addexpense', newDailyExpense, {
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
		setWeeklyBudgetLeft(weeklyBudgetTotal - calculateTotal([newDailyExpense, ...dailyExpensesArr]))
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
			await axios.delete(`http://localhost:5005/budget/deleteexpense/${expenseId}`, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			navigate('/budget')
		} catch (err) {
			console.log('THIS IS THE ERR', err)
		}

		setdailyExpensesTotal(calculateTotal(filteredDailyExpensesArr))
		setWeeklyBudgetLeft(weeklyBudgetTotal - calculateTotal(filteredDailyExpensesArr))
	}

	return (
		<>
			<div className="card">
				<small>
					<mark>current week</mark>
					<div>
						{firstDayOfWeek} – {lastDayOfWeek}
					</div>
				</small>
				<h1>Budget left this week:</h1>
				<big>
					{weeklyBudgetLeft.toFixed(2)} {propBudgetData.currency}
				</big>
				of {weeklyBudgetTotal.toFixed(2)} {propBudgetData.currency}
				<br />
				<br />
				<div className="grid">
					<button>« prev week</button>
					<button>» next week</button>
				</div>
			</div>
			<h2>Add an expense:</h2>
			<form onSubmit={handleAddDailyExpense} className="form-daily-expenses">
				<div className="grid">
					<input type="date" name="date" required></input>
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
												<time dateTime={dailyExpense.date}>
													{weekdaysArr[new Date(Date.parse(dailyExpense.date)).getDay()]},&nbsp;
													{dailyExpense.date.slice(8, 10)}
												</time>
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
					</table>
				)}
			</div>
		</>
	)
}

export default DailyExpensesForm
