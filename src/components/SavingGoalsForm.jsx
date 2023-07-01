import { useState } from "react";
import savingGoalsGif from "../assets/gif-no-savings.gif"

// this is just test data. we should delete it later

function SavingGoalsForm() {
    const [savingGoalsArr, setSavingGoalsArr] = useState([{
        name: "Horse",
        amount: 10000,
        amountSaved: 5,
        time: 2,
        isReached: false,
    }, {
        name: "Canoe",
        amount: 900,
        amountSaved: 339.23,
        time: 3,
        isReached: true,
    }, {
        name: "Private Island",
        amount: 10000000,
        amountSaved: 339.23,
        time: 3,
        isReached: true,
    }]);

    const handleAddSavingGoal = (event) => {
        event.preventDefault()
        const newSavingGoal = {
            name: event.target.name.value,
            amount: event.target.amount.value,
            amountSaved: 0,
            time: event.target.time.value,
            isReached: false,
        }
        setSavingGoalsArr([newSavingGoal, ...savingGoalsArr])
    }

    const handleDeleteSavingGoal = (index, event) => {
        event.preventDefault()
        const filteredSavingGoalsArr = savingGoalsArr.filter((elem, i) => {
            if (i !== index) return elem
        })
        setSavingGoalsArr(filteredSavingGoalsArr)
    }

    return (
        <>
            {savingGoalsArr.length <= 0 ? (
                <div className="card">
                    <div className="card-empty-text">
                        <h4>No saving goals yet.</h4>
                        <p>
                            Start adding some via the form below.
                        </p>
                        <img src={savingGoalsGif} alt="" width="300" />
                    </div>
                </div>
            ) : (
                <div className="card">
                    <table className="table-saving-goals">
                        <thead>
                            <tr>
                                <th>Goal</th>
                                <th>Saved</th>
                                <th>Missing</th>
                                <th>for a</th>
                                <th>over a period of</th>
                                <th>delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savingGoalsArr.map((savingGoal, index) => {
                                return (
                                    <tr key={index}>
                                        <td><strong>{savingGoal.amount}</strong></td>
                                        <td>{savingGoal.amountSaved}</td>
                                        <td>{savingGoal.amount - savingGoal.amountSaved}</td>
                                        <td>{savingGoal.name}</td>
                                        <td>{savingGoal.time} months</td>
                                        <td>
                                            <button className="btn-delete-item" onClick={(event) => handleDeleteSavingGoal(index, event)}>
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
            <form onSubmit={handleAddSavingGoal} className="form-saving-goals">
                <div className="grid">
                    <div>
                        <label>I want to save</label>
                        <input type="number" name="amount" placeholder="0,00" required></input>
                    </div>
                    <div>
                        <label>for a</label>
                        <input type="text" name="name" placeholder="name" required></input>
                    </div>
                </div>
                <div>
                    <label>over a period of</label>
                    <div className="grid">
                        <input type="number" name="time" placeholder="0" required></input>
                        <p>months</p>
                    </div>
                </div>
                <div>
                    <label>which is</label>
                    <big>___ € / month</big>
                </div>
                <button>add saving goal</button>
            </form>
            <h2>Your past saving goals:</h2>
            <div className="card">
                <table className="table-saving-goals">
                    <thead>
                        <tr>
                            <th>You saved</th>
                            <th>for a</th>
                            <th>over a period of</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>

                {/* ----- DISPLAYING THE COMPLETED GOALS DOESN'T WORK YET ----- */}

                {savingGoalsArr.filter((savingGoal, index) => {
                    if (savingGoal.isReached === true) {
                        {/* return (
                            <tr key={savingGoal.index}>
                                <td><strong>{savingGoal.amount}</strong></td>
                                <td>{savingGoal.name}</td>
                                <td>{savingGoal.time} months</td>
                            </tr>
                        ) */}
                    }
                })}
            </div>
        </>
    )
}

export default SavingGoalsForm