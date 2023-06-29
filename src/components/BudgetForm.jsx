import { useState, useEffect } from "react";

function BudgetForm() {
  const [currency, setCurrency] = useState("€");
  const [earnings, setEarnings] = useState([
    { name: "monthly earnings", amount: 0 },
  ]);
  const [expenses, setExpenses] = useState([
    { name: "rent", amount: 0 },
    { name: "electricity", amount: 0 },
    { name: "heating", amount: 0 },
  ]);

  const [savings, setSavings] = useState([
    { name: "My saving goal", amount: 0 },
  ]);

  console.log(expenses);

  const handleChange = (index, e) => {
    const newExpenses = [...expenses];
    newExpenses[index].amount = Number(e.target.value);
    setExpenses(newExpenses);
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
          <div className="grid">
            <label>{earnings[0].name}</label>
            <input
              type="number"
              min="0"
              value={earnings[0].amount}
              name={earnings[0].name}
              onChange={(e) =>
                setEarnings([
                  {
                    name: "monthly earnings",
                    amount: e.target.value,
                  },
                ])
              }
            />
            <span className="currency">{`${currency}`}</span>
            <button className="btn-delete-item" /*onSubmit={deleteItem}*/>
              –
            </button>
          </div>
          <div className="grid">
            <input
              type="text"
              /*value={ }*/ name=""
              onChange={handleChange}
              placeholder="name"
            />
            <input
              type="number"
              min="0"
              /*value={ }*/ name=""
              onChange={handleChange}
            />
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" /*onSubmit={addItem}*/>+</button>
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
                  onChange={(e) => handleChange(index, e)}
                />
                <span className="currency">{`${currency}`}</span>
                <button className="btn-delete-item" /*onSubmit={deleteItem}*/>
                  –
                </button>
              </div>
            );
          })}

          <div className="grid">
            <input
              type="text"
              /*value={ }*/ name=""
              onChange={handleChange}
              placeholder="name"
            />
            <input
              type="number"
              min="0"
              /*value={ }*/ name=""
              onChange={handleChange}
            />
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" /*onSubmit={addItem}*/>+</button>
          </div>
        </fieldset>
        <fieldset id="savings">
          <legend>Your saving goals</legend>
          <div className="grid">
            <label>Horst's saving goal</label>
            <input
              type="number"
              min="0"
              /*value={ }*/ name=""
              onChange={handleChange}
            />
            <span className="currency">{`${currency}`}</span>
            <button className="btn-delete-item" /*onSubmit={deleteItem}*/>
              –
            </button>
          </div>
          <div className="grid">
            <input
              type="text"
              /*value={ }*/ name=""
              onChange={handleChange}
              placeholder="name"
            />
            <input
              type="number"
              min="0"
              /*value={ }*/ name=""
              onChange={handleChange}
            />
            <span className="currency">{`${currency}`}</span>
            <button className="btn-add-item" /*onSubmit={addItem}*/>+</button>
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
