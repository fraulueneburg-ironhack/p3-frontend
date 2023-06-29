import { useState, useEffect } from "react"

function BudgetForm() {

    // const [currency, setCurrency] = useState("€");

    // console.log("THE CURRENCY", currency);


    const [userObj, setUserObj] = useState({
        currency: "€",
        earnings: [
            { name: "monthly earnings", amount: 0 }
        ],
        expenses: [
            { name: "rent", amount: 0 },
            { name: "electricity", amount: 0 },
            { name: "heating", amount: 0 },
        ],
        savings: [
            { name: "My saving goal", amount: 0 }
        ]
    });

    const currency = userObj.currency;

    const handleChange = (e) => {
        let inputName = e.target.name;
        let inputValue = e.target.value;
        let parent = e.target.parentElement.parentElement.id;

        if (inputName === "currency") {
            setUserObj({ ...userObj, [inputName]: inputValue })
        }
        else {
            //setUserObj({ ...userObj, [parent[0]]: { ...userObj.parent, amount: 999 } })
            setUserObj({
                ...userObj, [parent]: { ...userObj.expenses, 0: { name: inputName, amount: inputValue } }
            })

            console.log("USER OBJ", userObj);
        }
    };

    return (
        <>
            <form className="form-budget">
                <fieldset>
                    <legend>Your currency</legend>
                    <select name="currency" onChange={handleChange}>
                        <option value="€">€</option>
                        <option value="US$">US$</option>
                        <option value="GBP">GBP</option>
                    </select>
                </fieldset>
                <fieldset id="earnings">
                    <legend>Your earnings</legend>
                    <div className="grid">
                        <label>{userObj.earnings[0].name}</label>
                        <input type="number" min="0" value={userObj.earnings[0].amount} name={userObj.earnings[0].name} onChange={handleChange} />
                        <span className="currency">{`${currency}`}</span>
                        <button className="btn-delete-item" /*onSubmit={deleteItem}*/>–</button>
                    </div>
                    <div className="grid">
                        <input type="text" /*value={ }*/ name="" onChange={handleChange} placeholder="name" />
                        <input type="number" min="0" /*value={ }*/ name="" onChange={handleChange} />
                        <span className="currency">{`${currency}`}</span>
                        <button className="btn-add-item" /*onSubmit={addItem}*/>+</button>
                    </div>
                </fieldset>
                <fieldset id="expenses">
                    <legend>Your expenses</legend>
                    <div className="grid">
                        <label>{userObj.expenses[0].name}</label>
                        <input type="number" min="0" value={userObj.expenses[0].amount} name={userObj.expenses[0].name} onChange={handleChange} />
                        <span className="currency">{`${currency}`}</span>
                        <button className="btn-delete-item" /*onSubmit={deleteItem}*/>–</button>
                    </div>
                    <div className="grid">
                        <label>{userObj.expenses[1].name}</label>
                        <input type="number" min="0" value={userObj.expenses[1].amount} name={userObj.expenses[1].name} onChange={handleChange} />
                        <span className="currency">{`${currency}`}</span>
                        <button className="btn-delete-item" /*onSubmit={deleteItem}*/>–</button>
                    </div>
                    <div className="grid">
                        <label>{userObj.expenses[2].name}</label>
                        <input type="number" min="0" value={userObj.expenses[2].amount} name={userObj.expenses[2].name} onChange={handleChange} />
                        <span className="currency">{`${currency}`}</span>
                        <button className="btn-delete-item" /*onSubmit={deleteItem}*/>–</button>
                    </div>
                    <div className="grid">
                        <input type="text" /*value={ }*/ name="" onChange={handleChange} placeholder="name" />
                        <input type="number" min="0" /*value={ }*/ name="" onChange={handleChange} /><span className="currency">{`${currency}`}</span>
                        <button className="btn-add-item" /*onSubmit={addItem}*/>+</button>
                    </div>
                </fieldset>
                <fieldset id="savings">
                    <legend>Your saving goals</legend>
                    <div className="grid">
                        <label>Horst's saving goal</label>
                        <input type="number" min="0" /*value={ }*/ name="" onChange={handleChange} /><span className="currency">{`${currency}`}</span>
                        <button className="btn-delete-item" /*onSubmit={deleteItem}*/>–</button>
                    </div>
                    <div className="grid">
                        <input type="text" /*value={ }*/ name="" onChange={handleChange} placeholder="name" />
                        <input type="number" min="0" /*value={ }*/ name="" onChange={handleChange} /><span className="currency">{`${currency}`}</span>
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
    )
}

export default BudgetForm