import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import earningsGif from "../assets/gif-no-earnings.gif"
import expensesGif from "../assets/gif-no-expenses.gif"
import spendingsGif from "../assets/gif-no-spendings.gif"
//import savingsGif from "../assets/gif-no-savings.gif"
import axios from 'axios'

function BudgetForm() {
  const navigate = useNavigate();

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

  // SPENDING CATEGORIES STATES

  const [spendingCats, setSpendingCats] = useState(['Food', 'Hobbies', 'Activities', 'Other'])
  const [newSpendingCatName, setNewSpendingCatName] = useState('')

  // SAVINGS STATES

  const savingsTotal = 0;
  // const [savings, setSavings] = useState([{ name: 'My saving goal', amount: 0 }])
  // const [savingsTotal, setSavingsTotal] = useState(calculateTotal(savings))
  // const [newSavingName, setNewSavingName] = useState('')
  // const [newSavingAmount, setNewSavingAmount] = useState('')

  // MONTHLY BUDGET STATE

  const [budget, setBudget] = useState(earningsTotal - expensesTotal - savingsTotal)

  // EARNINGS FUNCTIONS

  const handleEarningAmountChange = (index, event) => {
    const newEarnings = [...earnings]
    newEarnings[index].amount = Number(event.target.value)
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
    setNewEarningAmount('')
  }

  const handleDeleteEarning = (index, event) => {
    event.preventDefault()
    const filteredEarnings = earnings.filter((elem, i) => {
      if (i !== index) return elem
    })
    setEarnings(filteredEarnings)
    setEarningsTotal(calculateTotal(filteredEarnings))
    setBudget(calculateTotal(filteredEarnings) - expensesTotal - savingsTotal)
  }

  // EXPENSES FUNCTIONS

  const handleExpenseAmountChange = (index, event) => {
    const newExpenses = [...expenses]
    newExpenses[index].amount = Number(event.target.value)
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
    setNewExpenseAmount('')
  }

  const handleDeleteExpense = (index, event) => {
    event.preventDefault()
    const filteredExpenses = expenses.filter((elem, i) => {
      if (i !== index) return elem
    })
    setExpenses(filteredExpenses)
    setExpensesTotal(calculateTotal(filteredExpenses))
    setBudget(earningsTotal - calculateTotal(filteredExpenses) - savingsTotal)
  }

  // SAVINGS FUNCTIONS
  // const handleSavingAmountChange = (index, event) => {
  //   const newSavings = [...savings]
  //   newSavings[index].amount = Number(event.target.value)
  //   setSavings(newSavings)
  //   setSavingsTotal(calculateTotal(newSavings))
  //   setBudget(earningsTotal - expensesTotal - calculateTotal(newSavings))
  // }
  // const handleNewSavingNameChange = (event) => {
  //   setNewSavingName(event.target.value)
  // }

  // const handleNewSavingAmountChange = (event) => {
  //   setNewSavingAmount(Number(event.target.value))
  //   setSavingsTotal(calculateTotal(savings))
  //   setBudget(earningsTotal - expensesTotal - calculateTotal(savings))
  // }

  // const handleAddSaving = (event) => {
  //   event.preventDefault()
  //   const newSaving = {
  //     name: newSavingName,
  //     amount: newSavingAmount,
  //   }
  //   setSavings([...savings, newSaving])
  //   setSavingsTotal(calculateTotal([...savings, newSaving]))
  //   setBudget(earningsTotal - expensesTotal - calculateTotal([...savings, newSaving]))
  //   setNewSavingName('')
  //   setNewSavingAmount('')
  // }

  // const handleDeleteSaving = (index, event) => {
  //   event.preventDefault()
  //   const filteredSavings = savings.filter((elem, i) => {
  //     if (i !== index) return elem
  //   })
  //   setSavings(filteredSavings)
  //   setSavingsTotal(calculateTotal(filteredSavings))
  //   setBudget(earningsTotal - expensesTotal - calculateTotal(filteredSavings))
  // }


  // SPENDING CATEGORIES FUNCTIONS
  const handleNewSpendingCatNameChange = (event) => {
    setNewSpendingCatName(event.target.value)
  }

  const handleAddSpendingCat = (event) => {
    event.preventDefault()
    const newSpendingCat = newSpendingCatName;
    setSpendingCats([...spendingCats, newSpendingCat])
    setNewSpendingCatName('')
  }

  const handleDeleteSpendingCat = (index, event) => {
    event.preventDefault()
    const filteredSpendingCats = spendingCats.filter((elem, i) => {
      if (i !== index) return elem
    })
    setSpendingCats(filteredSpendingCats)
  }

  // BUDGET SUBMIT FUNCTIONS

  const handleSubmitBudget = async (event) => {
    event.preventDefault();
    const gotToken = localStorage.getItem("authToken");

    try {
      await axios.post("http://localhost:5005/budget/create", {
        //user: userId,
        currency: currency,
        earnings: earnings,
        expenses: expenses,
        spendingCategories: spendingCats,
      }, { headers: { authorization: `Bearer ${gotToken}` } });
      navigate("/profile");
    } catch (err) {
      console.log("im in the catch block");
      console.log("THIS IS THE ERR", err)
    }
  };

  // BUDGET FORM

  return (
    <>
      <form onSubmit={handleSubmitBudget} className="form-budget">
        <fieldset>
          <legend>Your currency</legend>
          <select name="currency" onChange={(event) => setCurrency(event.target.value)}>
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
                    placeholder="0"
                    min="0"
                    value={earning.amount}
                    name={earning.name}
                    onChange={(event) => handleEarningAmountChange(index, event)}
                  />
                  <span className="currency">{`${currency}`}</span>
                  <button className="btn-delete-item" onClick={(event) => handleDeleteEarning(index, event)}>
                    –
                  </button>
                </div>
              )
            })}
          </div>
          <div className="grid">
            <input type="text" value={newEarningName} onChange={handleNewEarningNameChange} placeholder="name" />
            <input type="number" placeholder="0" min="0" value={newEarningAmount} onChange={handleNewEarningAmountChange} />
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
                      placeholder="0"
                      min="0"
                      value={expense.amount}
                      name={expense.name}
                      onChange={(event) => handleExpenseAmountChange(index, event)}
                    />
                  </div>
                  <span className="currency">{`${currency}`}</span>
                  <button className="btn-delete-item" onClick={(event) => handleDeleteExpense(index, event)}>
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
              <input type="number"
                placeholder="0" min="0" value={newExpenseAmount} onChange={handleNewExpenseAmountChange} />
            </div>
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" onClick={handleAddExpense}>
              +
            </button>
          </div>
        </fieldset>

        {/* <fieldset id="savings">
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
                      placeholder="0"
                      min="0"
                      value={saving.amount}
                      name={saving.name}
                      onChange={(event) => handleSavingAmountChange(index, event)}
                    />
                  </div>
                  <span className="currency">{`${currency}`}</span>
                  <button className="btn-delete-item" onClick={(event) => handleDeleteSaving(index, event)}>
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
              <input type="number" placeholder="0" min="0" value={newSavingAmount} onChange={handleNewSavingAmountChange} />
            </div>
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" onClick={handleAddSaving}>
              +
            </button>
          </div>
        </fieldset> */}

        <fieldset>
          <legend>Your monthly budget:</legend>
          <big>{budget} <span className="currency">{`${currency}`}</span></big>
        </fieldset>

        <fieldset id="spendingCats">
          <legend>Your spending categories</legend>
          <div className="card">
            {spendingCats.length <= 0 ? (
              <div className="card-empty-text">
                <img src={spendingsGif} alt="" width="300" />
                <h4>No spending categories yet.</h4>
                <p>
                  Start adding some via the form below.
                </p>
              </div>
            ) : null}
            {spendingCats.map((spendingCat, index) => {
              return (
                <div key={index} className="grid">
                  <strong>{spendingCat}</strong>
                  <button className="btn-delete-item" onClick={(event) => handleDeleteSpendingCat(index, event)}>
                    –
                  </button>
                </div>
              )
            })}
          </div>
          <div className="grid">
            <input type="text" value={newSpendingCatName} onChange={handleNewSpendingCatNameChange} placeholder="name" />
            <button className="btn-add-item" onClick={handleAddSpendingCat}>
              +
            </button>
          </div>
        </fieldset>

        <button>Start planning</button>
      </form>
    </>
  )
}

export default BudgetForm
