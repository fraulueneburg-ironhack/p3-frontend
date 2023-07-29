import axios from 'axios'
import Chart from 'chart.js/auto'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import { CategoryScale } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { ReactComponent as IconEdit } from '../assets/icon-edit.svg'
import { ReactComponent as IconMinus } from '../assets/icon-minus.svg'
import { ReactComponent as IconPlus } from '../assets/icon-plus.svg'
import { ReactComponent as IconChevronLeft } from '../assets/icon-chevron-left.svg'
import { ReactComponent as IconChevronRight } from '../assets/icon-chevron-right.svg'
import { ReactComponent as IconClose } from '../assets/icon-close.svg'
import dailyExpensesGif from '../assets/gif-no-daily-expenses.gif'
import noChartGif from '../assets/gif-no-chart.gif'

function DailyExpensesForm(props) {
	const navigate = useNavigate()
	const propBudgetData = props.budgetData[0]
	const categoriesArr = propBudgetData.spendingCategories
	const currency = propBudgetData.currency
	const propDailyExpensesData = props.dailyExpensesData
	const gotToken = localStorage.getItem('authToken')
	const chartColorsArr = [
		'#00acc1',
		'#8e24aa',
		'#7cb342',
		'#f3ba2f',
		'#2a71d0',
		'#546e7a',
		'#00897b',
		'#5e35b1',
		'#d81b60',
		'#c0ca33',
		'#f4511e',
	]

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
	const dateTodayISO = new Date().toISOString().slice(0, 10)
	const lastDayFromToday = new Date(new Date().setDate(new Date().getDate() + (((-dayToday - 2) % 7) + 6)))
	const lastDayFromTodayISO = lastDayFromToday.toISOString().slice(0, 10)

	const [isCurrentTime, setIsCurrentTime] = useState(true)

	const [firstDay, setFirstDay] = useState(new Date(new Date().setDate(new Date().getDate() + ((-dayToday - 2) % 7))))
	const [lastDay, setLastDay] = useState(new Date(new Date().setDate(new Date().getDate() + (((-dayToday - 2) % 7) + 6))))
	const [firstDayISO, setFirstDayISO] = useState(firstDay.toISOString().slice(0, 10))
	const [lastDayISO, setLastDayISO] = useState(lastDay.toISOString().slice(0, 10))

	// DAILY EXPENSES

	const [dailyExpensesArr, setDailyExpensesArr] = useState(
		propDailyExpensesData.filter(
			(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
		)
	)

	const [dailyExpensesTotal, setdailyExpensesTotal] = useState(calculateTotal(dailyExpensesArr))
	const [budgetTotal, setBudgetTotal] = useState((monthlyBudget / 31) * 7)
	const [budgetLeft, setBudgetLeft] = useState(budgetTotal - dailyExpensesTotal)
	const [numOfItemsToNavigate, setNumOfItemsToNavigate] = useState(0)

	// SUM SPENT PER CATEGORY

	const [categoriesTotalArr, setCategoriesTotalArr] = useState(
		categoriesArr.map((oneCategory) => {
			return dailyExpensesArr.reduce((acc, curr) => {
				return curr.category === oneCategory ? acc + curr.amount : acc
			}, 0)
		})
	)

	// NAVIGATE BACK/FORTH

	useEffect(() => {
		setNumOfItemsToNavigate(0)
		timePeriod === 'week' ? setBudgetTotal((monthlyBudget / 31) * 7) : setBudgetTotal(monthlyBudget)
	}, [timePeriod, monthlyBudget])

	useEffect(() => {
		// Convert ISO format strings to JavaScript Date objects
		let currentFirstDay = new Date(firstDay)
		let currentLastDay = new Date(lastDay)
		const oneWeek = 7 * 24 * 60 * 60 * 1000 // One week in milliseconds

		// Calculate new first and last day
		let newFirstDay = new Date(currentFirstDay.getTime() + numOfItemsToNavigate * oneWeek)
		let newLastDay = new Date(currentLastDay.getTime() + numOfItemsToNavigate * oneWeek)

		if (timePeriod === 'month') {
			const newDate = new Date()
			const timezoneOffsetHours = Math.floor(Math.abs(newDate.getTimezoneOffset()) / 60)
			newFirstDay = new Date(yearToday, monthToday + numOfItemsToNavigate, 1, timezoneOffsetHours)
			newLastDay = new Date(yearToday, monthToday + numOfItemsToNavigate + 1, 0, timezoneOffsetHours)
		}

		// convert back to ISO format strings + update state
		const newFirstDayISO = newFirstDay.toISOString().slice(0, 10)
		const newLastDayISO = newLastDay.toISOString().slice(0, 10)
		setFirstDayISO(newFirstDayISO)
		setLastDayISO(newLastDayISO)
		setDailyExpensesArr(
			propDailyExpensesData.filter(
				(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
			)
		)

		// check if today’s week/month
		setIsCurrentTime(
			(timePeriod === 'month' && yearToday === +lastDayISO.slice(0, 4) && monthToday + 1 === +lastDayISO.slice(5, 7)) ||
				(timePeriod === 'week' &&
					new Date().toISOString().slice(0, 10) >= firstDayISO &&
					new Date().toISOString().slice(0, 10) <= lastDayISO)
				? true
				: false
		)
	}, [firstDayISO, lastDayISO, numOfItemsToNavigate, timePeriod, propDailyExpensesData])

	useEffect(() => {
		setdailyExpensesTotal(calculateTotal(dailyExpensesArr))
		setBudgetLeft(budgetTotal - calculateTotal(dailyExpensesArr))

		if (timePeriod === 'month') {
			setCategoriesTotalArr(
				categoriesArr.map((oneCategory) => {
					return dailyExpensesArr.reduce((acc, curr) => {
						return curr.category === oneCategory ? acc + curr.amount : acc
					}, 0)
				})
			)
		}
	}, [dailyExpensesArr, budgetTotal, categoriesArr, timePeriod])

	useEffect(() => {
		setChartData({
			labels: categoriesArr,
			datasets: [
				{
					data: categoriesTotalArr,
					backgroundColor: chartColorsArr,
					borderColor: '#11191f',
					borderWidth: 2,
				},
			],
		})
	}, [categoriesArr, categoriesTotalArr])

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

		event.target.name.value = ''
		event.target.amount.value = ''
	}

	// DELETE EXPENSE

	const handleDeleteDailyExpense = async (index, event) => {
		event.preventDefault()
		const filteredDailyExpensesArr = dailyExpensesArr.filter((elem, i) => {
			return i !== index ? elem : null
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

	// EDIT EXPENSE

	const [editExpenseId, setEditExpenseId] = useState(0)
	const [editExpenseName, setEditExpenseName] = useState()
	const [editExpenseDate, setEditExpenseDate] = useState()
	const [editExpenseCategory, setEditExpenseCategory] = useState()
	const [editExpenseAmount, setEditExpenseAmount] = useState(0)

	const handleEditDailyExpense = (event) => {
		event.preventDefault()
		const expenseId = event.target.getAttribute('data-key')
		const expenseData = dailyExpensesArr.find((elem) => elem._id === expenseId)
		setEditExpenseId(expenseId)
		setEditExpenseDate(expenseData.date.slice(0, 10))
		setEditExpenseName(expenseData.name)
		setEditExpenseCategory(expenseData.category)
		setEditExpenseAmount(expenseData.amount.toFixed(2))
	}

	const handleUpdateDailyExpense = async (event) => {
		event.preventDefault()
		const expenseId = event.target.getAttribute('data-key')
		const gotToken = localStorage.getItem('authToken')
		const updatedExpense = {
			amount: +editExpenseAmount,
			category: editExpenseCategory,
			date: new Date(editExpenseDate),
			name: editExpenseName,
		}

		try {
			await axios.post(`${API_URL}/budget/updateexpense/${expenseId}`, updatedExpense, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			const expenseIndex = dailyExpensesArr.findIndex((elem) => elem._id === expenseId)
			let updatedDailyExpenseArr = [...dailyExpensesArr]
			updatedDailyExpenseArr[expenseIndex].amount = +editExpenseAmount
			updatedDailyExpenseArr[expenseIndex].category = editExpenseCategory
			updatedDailyExpenseArr[expenseIndex].date = editExpenseDate
			updatedDailyExpenseArr[expenseIndex].name = editExpenseName
			setDailyExpensesArr(updatedDailyExpenseArr)
			setdailyExpensesTotal(calculateTotal(updatedDailyExpenseArr))
			setBudgetLeft(budgetTotal - calculateTotal(updatedDailyExpenseArr))
			setEditExpenseId(0)
			navigate('/budget')
		} catch (err) {
			console.log('im in the catch block')
			console.log('THIS IS THE ERR', err)
		}
	}

	// CHART

	Chart.register(CategoryScale)
	const [chartData, setChartData] = useState({
		labels: categoriesArr,
		datasets: [
			{
				data: categoriesTotalArr,
				backgroundColor: chartColorsArr,
				borderColor: '#11191f',
				borderWidth: 2,
			},
		],
	})

	return (
		<>
			<section style={{ overflow: 'hidden' }}>
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
					<h2>Budget left this {timePeriod}:</h2>
					<p>
						<big className={`${budgetLeft < 0 ? 'is-negative' : null}`}>
							{budgetLeft.toFixed(2)} {currency}
						</big>
						of {budgetTotal.toFixed(2)} {currency}
					</p>
					<div className="btn-group nav-prev-next">
						<button onClick={() => setNumOfItemsToNavigate((prev) => prev - 1)} aria-label={`go to previous ${timePeriod}`}>
							<IconChevronLeft />
						</button>
						<button
							onClick={() => setNumOfItemsToNavigate((prev) => prev + 1)}
							aria-label={`go to next ${timePeriod}`}
							disabled={isCurrentTime}>
							<IconChevronRight />
						</button>
					</div>
				</div>
			</section>
			{timePeriod === 'month' ? (
				<>
					<section>
						<h2>Budget spent by Category:</h2>
						<div className="columns is-vcentered">
							<div className="column chart-container">
								{dailyExpensesTotal <= 0 ? (
									<div className="card">
										<div className="card-empty-text">
											<img src={noChartGif} alt="" />
											<h4>No chart to display.</h4>
											<p>
												Wow. You spent 0,00{currency} this {timePeriod}.<br />
												Good job. But also: Are you sure? 🤔
											</p>
										</div>
									</div>
								) : (
									<Pie
										data={chartData}
										options={{
											responsive: true,
											plugins: {
												title: { display: true },
												legend: { display: false },
												tooltip: {
													displayColors: false,
													padding: 12,
													callbacks: {
														label: (item) => `${item.formattedValue}${currency}`,
													},
													titleFont: {
														size: 16,
														family: 'system-ui',
													},
													bodyFont: {
														size: 16,
														family: 'system-ui',
													},
												},
											},
										}}
									/>
								)}
							</div>
							<div className="column">
								<table>
									<thead>
										<tr>
											<th>Category</th>
											<th style={{ textAlign: 'right' }}>Total</th>
										</tr>
									</thead>
									<tbody>
										{categoriesTotalArr.map((elem, index) => {
											return (
												<tr className={elem > 0 ? null : 'greyed-out'}>
													<td>
														<div className="color-indicator" style={{ backgroundColor: chartColorsArr[index] }}></div>{' '}
														{categoriesArr[index]}
													</td>
													<td style={{ textAlign: 'right' }}>
														{elem.toFixed(2)} {currency}
													</td>
												</tr>
											)
										})}
									</tbody>
									<tfoot>
										<tr>
											<td></td>
											<td>
												{categoriesTotalArr
													.reduce((acc, curr) => {
														return acc + curr
													})
													.toFixed(2)}
												{` ${currency}`}
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					</section>
				</>
			) : null}
			<section>
				<h2>Add an expense:</h2>
				<form onSubmit={handleAddDailyExpense} className="form-daily-expenses">
					<div className="grid">
						<input
							type="date"
							name="date"
							min={firstDayISO}
							max={lastDayISO}
							placeholder={`${isCurrentTime ? dateTodayISO : firstDayISO}`}
							required></input>
						<select name="category">
							{propBudgetData.spendingCategories.map((elem, index) => {
								return <option key={elem + '-' + index}>{elem}</option>
							})}
						</select>
					</div>
					<div className="grid">
						<input type="text" name="name" placeholder="name"></input>
						<div className="input-group">
							<span className="input-group-text">–</span>
							<input type="number" name="amount" placeholder="0,00" step=".01" required></input>
							<span className="text">€</span>
							<button className="btn-add-item">
								<IconPlus />
							</button>
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
						<div className="table-wrapper">
							<table className="table-daily-expenses">
								<thead>
									<tr>
										<th style={{ width: '140px' }}>Date</th>
										<th>Category</th>
										<th>Name</th>
										<th style={{ textAlign: 'right' }}>Amount</th>
										<th style={{ textAlign: 'right', width: '130px' }}></th>
									</tr>
								</thead>
								<tbody>
									{dailyExpensesArr
										.sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0))
										.map((dailyExpense, index) => {
											if (dailyExpense._id !== editExpenseId) {
												return (
													<tr key={dailyExpense._id}>
														<td style={{ width: '140px' }}>
															<time dateTime={dailyExpense.date}>{writeOutDate(dailyExpense.date)}</time>
														</td>
														<td>
															<strong>{dailyExpense.category}</strong>
														</td>
														<td>{dailyExpense.name}</td>
														<td style={{ textAlign: 'right' }}>
															-{dailyExpense.amount.toFixed(2)} {currency}
														</td>
														<td>
															<button
																data-key={dailyExpense._id}
																className="btn-delete-item"
																onClick={(event) => handleDeleteDailyExpense(index, event)}>
																<IconMinus />
															</button>
															<button
																data-key={dailyExpense._id}
																className="btn-edit-item"
																onClick={(event) => handleEditDailyExpense(event)}>
																<IconEdit />
															</button>
														</td>
													</tr>
												)
											} else {
												return (
													<tr key={dailyExpense._id}>
														<td colSpan="5">
															<button onClick={() => setEditExpenseId(0)} className="btn-close" aria-label="close">
																<IconClose />
															</button>
															<form onSubmit={handleUpdateDailyExpense} data-key={dailyExpense._id}>
																<div className="grid">
																	<input
																		type="date"
																		name="date"
																		max={lastDayFromTodayISO}
																		value={editExpenseDate}
																		onChange={(event) => setEditExpenseDate(event.target.value)}
																		required
																	/>
																	<select
																		name="category"
																		value={editExpenseCategory}
																		onChange={(event) => setEditExpenseCategory(event.target.value)}
																		required>
																		{propBudgetData.spendingCategories.map((elem, index) => {
																			return <option key={elem + '-' + index}>{elem}</option>
																		})}
																	</select>
																</div>
																<div className="grid">
																	<input
																		type="text"
																		//value={dailyExpense.name}
																		value={editExpenseName}
																		onChange={(event) => setEditExpenseName(event.target.value)}
																		name="name"
																	/>
																	<div className="input-group">
																		<span className="input-group-text">–</span>
																		<input
																			type="number"
																			name="amount"
																			//value={dailyExpense.amount.toFixed(2)}
																			value={editExpenseAmount}
																			placeholder="0,00"
																			step=".01"
																			onChange={(event) => setEditExpenseAmount(event.target.value)}
																			required
																		/>
																		<span className="text">€</span>
																	</div>
																</div>
																<button type="submit" className="btn-save-item">
																	save changes
																</button>
															</form>
														</td>
													</tr>
												)
											}
										})}
								</tbody>
								<tfoot>
									<tr>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td>
											-{(budgetTotal - budgetLeft).toFixed(2)} {currency}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					)}
				</div>
			</section>
		</>
	)
}

export default DailyExpensesForm
