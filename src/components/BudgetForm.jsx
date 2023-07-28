import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import axios from 'axios'
import { ReactComponent as IconMinus } from '../assets/icon-minus.svg'
import { ReactComponent as IconPlus } from '../assets/icon-plus.svg'
import earningsGif from '../assets/gif-no-earnings.gif'
import expensesGif from '../assets/gif-no-expenses.gif'
import spendingsGif from '../assets/gif-no-spendings.gif'

function BudgetForm(props) {
	const navigate = useNavigate()
	const [dataLoaded, setDataLoaded] = useState(false)

	// GENERAL FUNCTIONS

	const calculateTotal = (arr) => {
		let sum = arr.reduce((acc, curr) => {
			return acc + curr.amount
		}, 0)
		return sum.toFixed(2)
	}

	// CURRENCY STATES

	const allCurrencies = ['€', '$', '£', '¥']
	const [currency, setCurrency] = useState('€')

	// EARNINGS STATES

	const [earnings, setEarnings] = useState([{ name: 'salary', amount: 0 }])
	const [earningsTotal, setEarningsTotal] = useState(calculateTotal(earnings))
	const [newEarningName, setNewEarningName] = useState('')
	const [newEarningAmount, setNewEarningAmount] = useState(0)

	// EXPENSES STATES

	const [expenses, setExpenses] = useState([
		{ name: 'rent', amount: 0 },
		{ name: 'electricity', amount: 0 },
		{ name: 'heating', amount: 0 },
	])
	const [expensesTotal, setExpensesTotal] = useState(calculateTotal(expenses))
	const [newExpenseName, setNewExpenseName] = useState('')
	const [newExpenseAmount, setNewExpenseAmount] = useState(0)

	// SPENDING CATEGORIES STATES

	const [spendingCategories, setSpendingCategories] = useState(['Food', 'Hobbies', 'Activities', 'Other'])
	const [newSpendingCategoryName, setNewSpendingCategoryName] = useState('')

	// SAVINGS STATES

	const savingsTotal = 0

	// MONTHLY BUDGET STATE

	const [monthlyBudget, setMonthlyBudget] = useState((earningsTotal - expensesTotal - savingsTotal).toFixed(2))

	// EARNINGS FUNCTIONS

	const handleEarningAmountChange = (index, event) => {
		const newEarnings = [...earnings]
		newEarnings[index].amount = Number(event.target.value)
		setEarnings(newEarnings)
		setEarningsTotal(calculateTotal(earnings))
		setMonthlyBudget((calculateTotal(earnings) - expensesTotal - savingsTotal).toFixed(2))
	}

	const handleNewEarningNameChange = (event) => {
		setNewEarningName(event.target.value)
	}

	const handleNewEarningAmountChange = (event) => {
		setNewEarningAmount(Number(event.target.value))
		setEarningsTotal(calculateTotal(earnings))
		setMonthlyBudget((calculateTotal(earnings) - expensesTotal - savingsTotal).toFixed(2))
	}

	const handleAddEarning = (event) => {
		event.preventDefault()
		const newEarning = {
			name: newEarningName,
			amount: newEarningAmount,
		}
		setEarnings([...earnings, newEarning])
		setEarningsTotal(calculateTotal([...earnings, newEarning]))
		setMonthlyBudget((calculateTotal([...earnings, newEarning]) - expensesTotal - savingsTotal).toFixed(2))
		setNewEarningName('')
		setNewEarningAmount('')
	}

	const handleDeleteEarning = (index, event) => {
		event.preventDefault()
		const filteredEarnings = earnings.filter((elem, i) => {
			if (i !== index) return elem
		})
		setEarnings(filteredEarnings)
		setEarningsTotal(calculateTotal(filteredEarnings))
		setMonthlyBudget((calculateTotal(filteredEarnings) - expensesTotal - savingsTotal).toFixed(2))
	}

	// EXPENSES FUNCTIONS

	const handleExpenseAmountChange = (index, event) => {
		const newExpenses = [...expenses]
		newExpenses[index].amount = Number(event.target.value)
		setExpenses(newExpenses)
		setExpensesTotal(calculateTotal(newExpenses))
		setMonthlyBudget((earningsTotal - calculateTotal(newExpenses) - savingsTotal).toFixed(2))
	}

	const handleNewExpenseNameChange = (event) => {
		setNewExpenseName(event.target.value)
	}

	const handleNewExpenseAmountChange = (event) => {
		setNewExpenseAmount(Number(event.target.value))
		setExpensesTotal(calculateTotal(expenses))
		setMonthlyBudget((earningsTotal - calculateTotal(expenses) - savingsTotal).toFixed(2))
	}

	const handleAddExpense = (event) => {
		event.preventDefault()
		const newExpense = {
			name: newExpenseName,
			amount: newExpenseAmount,
		}
		setExpenses([...expenses, newExpense])
		setExpensesTotal(calculateTotal([...expenses, newExpense]))
		setMonthlyBudget((earningsTotal - calculateTotal([...expenses, newExpense]) - savingsTotal).toFixed(2))
		setNewExpenseName('')
		setNewExpenseAmount('')
	}

	const handleDeleteExpense = (index, event) => {
		event.preventDefault()
		const filteredExpenses = expenses.filter((elem, i) => {
			if (i !== index) return elem
		})
		setExpenses(filteredExpenses)
		setExpensesTotal(calculateTotal(filteredExpenses))
		setMonthlyBudget((earningsTotal - calculateTotal(filteredExpenses) - savingsTotal).toFixed(2))
	}

	// SPENDING CATEGORIES FUNCTIONS

	const handleNewSpendingCategoryNameChange = (event) => {
		setNewSpendingCategoryName(event.target.value)
	}

	const handleAddSpendingCategory = (event) => {
		event.preventDefault()
		const newSpendingCategory = newSpendingCategoryName
		setSpendingCategories([...spendingCategories, newSpendingCategory])
		setNewSpendingCategoryName('')
	}

	const handleDeleteSpendingCategory = (index, event) => {
		event.preventDefault()
		const filteredSpendingCategories = spendingCategories.filter((elem, i) => {
			if (i !== index) return elem
		})
		setSpendingCategories(filteredSpendingCategories)
	}

	// SET EXISTING BUDGET DATA

	useEffect(() => {
		const setInitialBudgetData = async () => {
			if (props.budgetData.length > 0) {
				setCurrency(props.budgetData[0].currency)
				setEarnings(props.budgetData[0].earnings)
				setExpenses(props.budgetData[0].expenses)
				setSpendingCategories(props.budgetData[0].spendingCategories)

				setEarningsTotal(calculateTotal(props.budgetData[0].earnings))
				setExpensesTotal(calculateTotal(props.budgetData[0].expenses))
				setMonthlyBudget(
					(
						calculateTotal(props.budgetData[0].earnings) -
						calculateTotal(props.budgetData[0].expenses) -
						savingsTotal
					).toFixed(2)
				)
			}
		}
		setInitialBudgetData()
		setDataLoaded(true)
	}, [props])

	// BUDGET SUBMIT FUNCTIONS

	const handleSubmitBudget = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')

		try {
			await axios.post(
				`${API_URL}/budget/create`,
				{
					currency: currency,
					earnings: earnings,
					expenses: expenses,
					spendingCategories: spendingCategories,
				},
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			navigate('/budget')
		} catch (err) {
			console.log('im in the catch block')
			console.log('THIS IS THE ERR', err)
		}
	}

	// BUDGET FORM

	if (dataLoaded) {
		return (
			<>
				<form onSubmit={handleSubmitBudget} className="form-budget">
					<fieldset>
						<legend>Your currency</legend>
						<select name="currency" value={currency} onChange={(event) => setCurrency(event.target.value)}>
							{allCurrencies.map((elem, index) => {
								return (
									<option key={index} value={elem}>
										{elem}
									</option>
								)
							})}
						</select>
					</fieldset>

					<fieldset id="earnings">
						<legend>Your monthly earnings</legend>
						<div className="card">
							{earnings.length <= 0 ? (
								<div className="card-empty-text">
									<img src={earningsGif} alt="" width="300" />
									<h4>No earnings yet. 😿</h4>
									<p>Start adding some via the form below.</p>
								</div>
							) : null}
							{earnings.map((earning, index) => {
								return (
									<div key={index} className="grid">
										<label>{earning.name}</label>
										<div className="input-group">
											<input
												type="number"
												min="0"
												placeholder="0,00"
												step=".01"
												value={earning.amount}
												name={earning.name}
												onChange={(event) => handleEarningAmountChange(index, event)}
											/>
											<span className="text">{`${currency}`}</span>
										</div>
										<button className="btn-delete-item" onClick={(event) => handleDeleteEarning(index, event)}>
											<IconMinus />
										</button>
									</div>
								)
							})}
						</div>
						<div className="grid">
							<input type="text" value={newEarningName} onChange={handleNewEarningNameChange} placeholder="name" />
							<div className="input-group">
								<input
									type="number"
									placeholder="0,00"
									step=".01"
									min="0"
									value={newEarningAmount}
									onChange={handleNewEarningAmountChange}
								/>
								<span className="text">{`${currency}`}</span>
							</div>
							<button className="btn-add-item" onClick={handleAddEarning}>
								<IconPlus />
							</button>
						</div>
					</fieldset>

					<fieldset id="expenses">
						<legend>Your monthly expenses</legend>
						<div className="card">
							{expenses.length <= 0 ? (
								<div className="card-empty-text">
									<img src={expensesGif} alt="" width="300" />
									<h4>No expenses yet.</h4>
									<p>Start adding some via the form below.</p>
								</div>
							) : null}
							{expenses.map((expense, index) => {
								return (
									<div key={index} className="grid">
										<label>{expense.name}</label>
										<div className="input-group">
											<span className="input-group-text">-</span>
											<input
												type="number"
												placeholder="0,00"
												step=".01"
												min="0"
												value={expense.amount}
												name={expense.name}
												onChange={(event) => handleExpenseAmountChange(index, event)}
											/>
											<span className="text">{`${currency}`}</span>
										</div>
										<button className="btn-delete-item" onClick={(event) => handleDeleteExpense(index, event)}>
											<IconMinus />
										</button>
									</div>
								)
							})}
						</div>
						<div className="grid">
							<input type="text" value={newExpenseName} onChange={handleNewExpenseNameChange} placeholder="name" />
							<div className="input-group">
								<span className="input-group-text">-</span>
								<input
									type="number"
									placeholder="0,00"
									step=".01"
									min="0"
									value={newExpenseAmount}
									onChange={handleNewExpenseAmountChange}
								/>
								<span className="text">{`${currency}`}</span>
							</div>
							<button className="btn-add-item" onClick={handleAddExpense}>
								<IconPlus />
							</button>
						</div>
					</fieldset>

					<fieldset>
						<legend>Your monthly budget:</legend>
						<big>
							{monthlyBudget} <span className="currency">{`${currency}`}</span>
						</big>
					</fieldset>

					<fieldset id="spendingCategories">
						<legend>Your spending categories</legend>
						<div className="card">
							{spendingCategories.length <= 0 ? (
								<div className="card-empty-text">
									<img src={spendingsGif} alt="" width="300" />
									<h4>No spending categories yet.</h4>
									<p>Start adding some via the form below.</p>
								</div>
							) : null}
							{spendingCategories.map((spendingCategory, index) => {
								return (
									<div key={index} className="grid">
										<strong>{spendingCategory}</strong>
										<button className="btn-delete-item" onClick={(event) => handleDeleteSpendingCategory(index, event)}>
											<IconMinus />
										</button>
									</div>
								)
							})}
						</div>
						<div className="grid">
							<input
								type="text"
								value={newSpendingCategoryName}
								onChange={handleNewSpendingCategoryNameChange}
								placeholder="name"
							/>
							<button className="btn-add-item" onClick={handleAddSpendingCategory}>
								<IconPlus />
							</button>
						</div>
					</fieldset>
					<button>Save changes and start planning</button>
				</form>
			</>
		)
	} else {
		return 'loading budget form'
	}
}

export default BudgetForm
