import { useState } from 'react'
import earningsGif from "../assets/gif-earnings.gif"
import expensesGif from "../assets/gif-expenses.gif"
import savingsGif from "../assets/gif-savings.gif"

function BudgetForm() {
  // GENERAL FUNCTIONS
  const calculateTotal = (arr) => {
    return arr.reduce((acc, curr) => {
      return acc + curr.amount
    }, 0)
  }

  // CURRENCY STATES
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

  // SAVINGS STATES
  const [savings, setSavings] = useState([{ name: 'My saving goal', amount: 0 }])
  const [savingsTotal, setSavingsTotal] = useState(calculateTotal(savings))
  const [newSavingName, setNewSavingName] = useState('')
  const [newSavingAmount, setNewSavingAmount] = useState(0)

  // MONTHLY BUDGET STATE
  const [budget, setBudget] = useState(earningsTotal - expensesTotal - savingsTotal)

  // EARNINGS FUNCTIONS
  const handleEarningAmountChange = (index, e) => {
    const newEarnings = [...earnings]
    newEarnings[index].amount = Number(e.target.value)
    setEarnings(newEarnings)
    setEarningsTotal(calculateTotal(earnings))
    setBudget(calculateTotal(earnings) - expensesTotal - savingsTotal)
  }

  const handleNewEarningNameChange = (event) => {
    setNewEarningName(event.target.value)
  }

  const handleNewEarningAmountChange = (event) => {
    setNewEarningAmount(Number(event.target.value))
    setEarningsTotal(calculateTotal(earnings))
    setBudget(calculateTotal(earnings) - expensesTotal - savingsTotal)
  }

  const handleAddEarning = (event) => {
    event.preventDefault()
    const newEarning = {
      name: newEarningName,
      amount: newEarningAmount,
    }
    setEarnings([...earnings, newEarning])
    setEarningsTotal(calculateTotal([...earnings, newEarning]))
    setBudget(calculateTotal([...earnings, newEarning]) - expensesTotal - savingsTotal)
    setNewEarningName('')
    setNewEarningAmount(0)
  }

  const handleDeleteEarning = (index, e) => {
    e.preventDefault()
    const filteredEarnings = earnings.filter((elem, i) => {
      if (i !== index) return elem
    })
    setEarnings(filteredEarnings)
    setEarningsTotal(calculateTotal(filteredEarnings))
    setBudget(calculateTotal(filteredEarnings) - expensesTotal - savingsTotal)
  }

  // EXPENSES FUNCTIONS
  const handleExpenseAmountChange = (index, e) => {
    const newExpenses = [...expenses]
    newExpenses[index].amount = Number(e.target.value)
    setExpenses(newExpenses)
    setExpensesTotal(calculateTotal(newExpenses))
    setBudget(earningsTotal - calculateTotal(newExpenses) - savingsTotal)
  }
  const handleNewExpenseNameChange = (event) => {
    setNewExpenseName(event.target.value)
  }

  const handleNewExpenseAmountChange = (event) => {
    setNewExpenseAmount(Number(event.target.value))
    setExpensesTotal(calculateTotal(expenses))
    setBudget(earningsTotal - calculateTotal(expenses) - savingsTotal)
  }

  const handleAddExpense = (event) => {
    event.preventDefault()
    const newExpense = {
      name: newExpenseName,
      amount: newExpenseAmount,
    }
    setExpenses([...expenses, newExpense])
    setExpensesTotal(calculateTotal([...expenses, newExpense]))
    setBudget(earningsTotal - calculateTotal([...expenses, newExpense]) - savingsTotal)
    setNewExpenseName('')
    setNewExpenseAmount(0)
  }

  const handleDeleteExpense = (index, e) => {
    e.preventDefault()
    const filteredExpenses = expenses.filter((elem, i) => {
      if (i !== index) return elem
    })
    setExpenses(filteredExpenses)
    setExpensesTotal(calculateTotal(filteredExpenses))
    setBudget(earningsTotal - calculateTotal(filteredExpenses) - savingsTotal)
  }

  // SAVINGS FUNCTIONS
  const handleSavingAmountChange = (index, e) => {
    const newSavings = [...savings]
    newSavings[index].amount = Number(e.target.value)
    setSavings(newSavings)
    setSavingsTotal(calculateTotal(newSavings))
    setBudget(earningsTotal - expensesTotal - calculateTotal(newSavings))
  }
  const handleNewSavingNameChange = (event) => {
    setNewSavingName(event.target.value)
  }

  const handleNewSavingAmountChange = (event) => {
    setNewSavingAmount(Number(event.target.value))
    setSavingsTotal(calculateTotal(savings))
    setBudget(earningsTotal - expensesTotal - calculateTotal(savings))
  }

  const handleAddSaving = (event) => {
    event.preventDefault()
    const newSaving = {
      name: newSavingName,
      amount: newSavingAmount,
    }
    setSavings([...savings, newSaving])
    setSavingsTotal(calculateTotal([...savings, newSaving]))
    setBudget(earningsTotal - expensesTotal - calculateTotal([...savings, newSaving]))
    setNewSavingName('')
    setNewSavingAmount(0)
  }

  const handleDeleteSaving = (index, e) => {
    e.preventDefault()
    const filteredSavings = savings.filter((elem, i) => {
      if (i !== index) return elem
    })
    setSavings(filteredSavings)
    setSavingsTotal(calculateTotal(filteredSavings))
    setBudget(earningsTotal - expensesTotal - calculateTotal(filteredSavings))
  }

  // BUDGET FORM

  return (
    <>
      <form className="form-budget">
        <fieldset>
          <legend>Your currency</legend>
          <select name="currency" onChange={(e) => setCurrency(e.target.value)}>
            <option value="€">€</option>
            <option value="US$">US$</option>
            <option value="GBP">GBP</option>
          </select>
        </fieldset>
        <fieldset id="earnings">
          <legend>Your earnings</legend>
          <div className="card">
            {earnings.length <= 0 ? (
              <div className="card-empty-text">
                <img src={earningsGif} alt="" width="300" />
                <h4>No earnings yet. 😿</h4>
                <p>
                  Start adding some via the form below.
                </p>
              </div>
            ) : null}
            {earnings.map((earning, index) => {
              return (
                <div key={index} className="grid">
                  <label>{earning.name}</label>
                  <input
                    type="number"
                    min="0"
                    value={earning.amount}
                    name={earning.name}
                    onChange={(e) => handleEarningAmountChange(index, e)}
                  />
                  <span className="currency">{`${currency}`}</span>
                  <button className="btn-delete-item" onClick={(e) => handleDeleteEarning(index, e)}>
                    –
                  </button>
                </div>
              )
            })}
          </div>
          <div className="grid">
            <input type="text" value={newEarningName} onChange={handleNewEarningNameChange} placeholder="name" />
            <input type="number" min="0" value={newEarningAmount} onChange={handleNewEarningAmountChange} />
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" onClick={handleAddEarning}>
              +
            </button>
          </div>
        </fieldset>

        <fieldset id="expenses">
          <legend>Your expenses</legend>
          <div className="card">
            {expenses.length <= 0 ? (
              <div className="card-empty-text">
                <img src={expensesGif} alt="" width="300" />
                <h4>No expenses yet.</h4>
                <p>
                  Start adding some via the form below.
                </p>
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
                      min="0"
                      value={expense.amount}
                      name={expense.name}
                      onChange={(e) => handleExpenseAmountChange(index, e)}
                    />
                  </div>
                  <span className="currency">{`${currency}`}</span>
                  <button className="btn-delete-item" onClick={(e) => handleDeleteExpense(index, e)}>
                    –
                  </button>
                </div>
              )
            })}
          </div>
          <div className="grid">
            <input type="text" value={newExpenseName} onChange={handleNewExpenseNameChange} placeholder="name" />
            <div className="input-group">
              <span className="input-group-text">-</span>
              <input type="number" min="0" value={newExpenseAmount} onChange={handleNewExpenseAmountChange} />
            </div>
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" onClick={handleAddExpense}>
              +
            </button>
          </div>
        </fieldset>

        <fieldset id="savings">
          <legend>Your monthly saving goals</legend>
          <div className="card">
            {savings.length <= 0 ? (
              <div className="card-empty-text">
                <img src={savingsGif} alt="" width="300" />
                <h4>No monthly saving goals yet.</h4>
                <p>
                  Start adding some via the form below.
                </p>
              </div>
            ) : null}
            {savings.map((saving, index) => {
              return (
                <div key={index} className="grid">
                  <label>{saving.name}</label>
                  <div className="input-group">
                    <span className="input-group-text">-</span>
                    <input
                      type="number"
                      min="0"
                      value={saving.amount}
                      name={saving.name}
                      onChange={(e) => handleSavingAmountChange(index, e)}
                    />
                  </div>
                  <span className="currency">{`${currency}`}</span>
                  <button className="btn-delete-item" onClick={(e) => handleDeleteSaving(index, e)}>
                    –
                  </button>
                </div>
              )
            })}
          </div>
          <div className="grid">
            <input type="text" value={newSavingName} onChange={handleNewSavingNameChange} placeholder="name" />
            <div className="input-group">
              <span className="input-group-text">-</span>
              <input type="number" min="0" value={newSavingAmount} onChange={handleNewSavingAmountChange} />
            </div>
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" onClick={handleAddSaving}>
              +
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend>Your spending categories</legend>
        </fieldset>
        <fieldset>
          <legend>Your monthly budget:</legend>
          <big>{budget}</big>
        </fieldset>
        <button>Start planning</button>
      </form>
    </>
  )
}

export default BudgetForm
