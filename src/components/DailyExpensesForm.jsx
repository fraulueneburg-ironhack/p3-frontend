import { useState } from 'react'
import dailyExpensesGif from "../assets/gif-no-daily-expenses.gif"

function DailyExpensesForm() {
    const [dailyExpensesArr, setDailyExpensesArr] = useState([]);

    const handleAddDailyExpense = (event) => {
        event.preventDefault()
        const newDailyExpense = {
            date: event.target.date.value,
            category: event.target.category.value,
            name: event.target.name.value,
            amount: event.target.amount.value
        }
        setDailyExpensesArr([newDailyExpense, ...dailyExpensesArr])
    }

    const handleDeleteDailyExpense = (index, event) => {
        event.preventDefault()
        const filteredDailyExpensesArr = dailyExpensesArr.filter((elem, i) => {
            if (i !== index) return elem
        })
        setDailyExpensesArr(filteredDailyExpensesArr)
    }

    return (
        <>
            <h2>Add an expense from today:</h2>
            <form onSubmit={handleAddDailyExpense} className="form-daily-expenses">
                <div className="grid">
                    <input type="date" name="date"></input>
                    <select name="category">
                        <option>Food</option>
                        <option>Hobbies</option>
                        <option>Party</option>
                    </select>
                    <input type="text" name="name" placeholder="name"></input>
                    <input type="number" name="amount" placeholder="0,00"></input>
                    <button className="btn-add-item">+</button>
                </div>
            </form>
            <h2>Your expenses this week:</h2>
            {dailyExpensesArr.length <= 0 ? (
                <div className="card">
                    <div className="card-empty-text">
                        <h4>No expenses yet.</h4>
                        <p>
                            Start adding some via the form above.
                        </p>
                        <img src={dailyExpensesGif} alt="" width="300" />
                    </div>
                </div>
            ) : (
                <div className="card">
                    <table className="table-daily-expenses">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyExpensesArr.map((dailyExpense, index) => {
                                return (
                                    <tr key={index}>
                                        <td><time dateTime={dailyExpense.date}>{dailyExpense.date}</time></td>
                                        <td><strong>{dailyExpense.category}</strong></td>
                                        <td>{dailyExpense.name}</td>
                                        <td>{dailyExpense.amount}</td>
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
                </div>
            )}
        </>
    )
}

export default DailyExpensesForm