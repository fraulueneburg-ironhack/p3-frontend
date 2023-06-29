import { useState, useEffect } from "react";

function BudgetForm() {
  const [currency, setCurrency] = useState("€");
  //Earnings states
  const [earnings, setEarnings] = useState([
    { name: "monthly earnings", amount: 0 },
  ]);
  const [newEarningName, setNewEarningName] = useState("");
  const [newEarningAmount, setNewEarningAmount] = useState(0);
  //Expenses states
  const [expenses, setExpenses] = useState([
    { name: "rent", amount: 0 },
    { name: "electricity", amount: 0 },
    { name: "heating", amount: 0 },
  ]);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState(0);

  //Savings states
  const [savings, setSavings] = useState([
    { name: "My saving goal", amount: 0 },
  ]);
  const [newSavingName, setNewSavingName] = useState("");
  const [newSavingAmount, setNewSavingAmount] = useState(0);

  //Monthly Budget Overview state
  const [budget, setBudget] = useState(0);

  //function for calculating Budget
  function calculateBudget(savings, expenses, earnings) {
    console.log(earnings);
    /*  const copy = JSON.parse(JSON.stringify(earnings));
    
    const result = copy.reduce(function (acc, obj) {
      return acc + obj.amount;
    }, 0);
    console.log(result); */
  }
  calculateBudget();

  //functions for expenses section
  const handleExpenseAmountChange = (index, e) => {
    const newExpenses = [...expenses];
    newExpenses[index].amount = Number(e.target.value);
    setExpenses(newExpenses);
  };
  const handleNewExpenseNameChange = (event) => {
    setNewExpenseName(event.target.value);
  };

  const handleNewExpenseAmountChange = (event) => {
    setNewExpenseAmount(Number(event.target.value));
  };

  const handleAddExpense = (event) => {
    event.preventDefault();
    const newExpense = {
      name: newExpenseName,
      amount: newExpenseAmount,
    };
    setExpenses([...expenses, newExpense]);
    setNewExpenseName("");
    setNewExpenseAmount(0);
  };

  const handleDeleteExpense = (index, e) => {
    e.preventDefault();
    let divToDelete = e.target.parentElement;
    console.log(divToDelete);
    console.log(index);
    /* const filteredExpenses = expenses.filter((elem,index) => !index); */

    const filteredExpenses = expenses.filter((elem, i) => {
      if (i !== index) return elem;
    });

    console.log(filteredExpenses);
    setExpenses(filteredExpenses);
  };
  //functions for Earnings section
  const handleEarningAmountChange = (index, e) => {
    const newEarnings = [...earnings];
    newEarnings[index].amount = Number(e.target.value);
    setEarnings(newEarnings);
  };
  const handleNewEarningNameChange = (event) => {
    setNewEarningName(event.target.value);
  };

  const handleNewEarningAmountChange = (event) => {
    setNewEarningAmount(Number(event.target.value));
  };

  const handleAddEarning = (event) => {
    event.preventDefault();
    const newEarning = {
      name: newEarningName,
      amount: newEarningAmount,
    };
    setEarnings([...earnings, newEarning]);
    setNewEarningName("");
    setNewEarningAmount(0);
  };
  const handleDeleteEarning = (index, e) => {
    e.preventDefault();
    let divToDelete = e.target.parentElement;
    console.log(divToDelete);
    console.log(index);
    /* const filteredExpenses = expenses.filter((elem,index) => !index); */

    const filteredEarnings = earnings.filter((elem, i) => {
      if (i !== index) return elem;
    });

    console.log(filteredEarnings);
    setEarnings(filteredEarnings);
  };

  //section for savings
  const handleSavingAmountChange = (index, e) => {
    const newSavings = [...savings];
    newSavings[index].amount = Number(e.target.value);
    setSavings(newSavings);
  };
  const handleNewSavingNameChange = (event) => {
    setNewSavingName(event.target.value);
  };

  const handleNewSavingAmountChange = (event) => {
    setNewSavingAmount(Number(event.target.value));
  };

  const handleAddSaving = (event) => {
    event.preventDefault();
    const newSaving = {
      name: newSavingName,
      amount: newSavingAmount,
    };
    setSavings([...savings, newSaving]);
    setNewSavingName("");
    setNewSavingAmount(0);
  };
  const handleDeleteSaving = (index, e) => {
    e.preventDefault();
    let divToDelete = e.target.parentElement;
    console.log(divToDelete);
    console.log(index);
    /* const filteredExpenses = expenses.filter((elem,index) => !index); */

    const filteredSavings = savings.filter((elem, i) => {
      if (i !== index) return elem;
    });

    console.log(filteredSavings);
    setSavings(filteredSavings);
  };

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
                <button
                  className="btn-delete-item"
                  onClick={(e) => handleDeleteEarning(index, e)}>
                  –
                </button>
              </div>
            );
          })}

          <div className="grid">
            <input
              type="text"
              value={newEarningName}
              onChange={handleNewEarningNameChange}
              placeholder="name"
            />
            <input
              type="number"
              min="0"
              value={newEarningAmount}
              onChange={handleNewEarningAmountChange}
            />
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" onClick={handleAddEarning}>
              +
            </button>
          </div>
        </fieldset>
        <fieldset id="expenses">
          <legend>Your expenses</legend>

          {expenses.map((expense, index) => {
            return (
              <div key={index} className="grid">
                <label>{expense.name}</label>
                <input
                  type="number"
                  min="0"
                  value={expense.amount}
                  name={expense.name}
                  onChange={(e) => handleExpenseAmountChange(index, e)}
                />
                <span className="currency">{`${currency}`}</span>
                <button
                  className="btn-delete-item"
                  onClick={(e) => handleDeleteExpense(index, e)}>
                  –
                </button>
              </div>
            );
          })}

          <div className="grid">
            <input
              type="text"
              value={newExpenseName}
              onChange={handleNewExpenseNameChange}
              placeholder="name"
            />
            <input
              type="number"
              min="0"
              value={newExpenseAmount}
              onChange={handleNewExpenseAmountChange}
            />
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" onClick={handleAddExpense}>
              +
            </button>
          </div>
        </fieldset>
        <fieldset id="savings">
          <legend>Your saving goals</legend>
          {savings.map((saving, index) => {
            return (
              <div key={index} className="grid">
                <label>{saving.name}</label>
                <input
                  type="number"
                  min="0"
                  value={saving.amount}
                  name={saving.name}
                  onChange={(e) => handleSavingAmountChange(index, e)}
                />
                <span className="currency">{`${currency}`}</span>
                <button
                  className="btn-delete-item"
                  onClick={(e) => handleDeleteSaving(index, e)}>
                  –
                </button>
              </div>
            );
          })}

          <div className="grid">
            <input
              type="text"
              value={newSavingName}
              onChange={handleNewSavingNameChange}
              placeholder="name"
            />
            <input
              type="number"
              min="0"
              value={newSavingAmount}
              onChange={handleNewSavingAmountChange}
            />
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
          <big>10.300,00€</big>
        </fieldset>
        <button>Start planning</button>
      </form>
    </>
  );
}

export default BudgetForm;
