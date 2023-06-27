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

        //you need the name of the input here
        //this is the value of what you typed in the input
        //spread the object to take everything that doesn't match the input name
        //setUserObj({ ...userObj, [inputName]: inputValue });
        let inputName = e.target.name;
        let inputValue = e.target.value;
        if (inputName === "currency") {
            setUserObj({ ...userObj, [inputName]: inputValue })
        }
        else {
            console.log("INPUT NAME RENT ETC", inputName)
            console.log("PARENT", e.target.parentElement.parentElement.id)
            //setUserObj({ ...userObj.expenses, userObj.expenses[inputName]: inputValue })
        }
        //setUserObj({ ...userObj, [inputName]: inputValue });
        console.log("NAME", inputName)
        console.log("VALUE", inputValue)
        console.log("THE USER OBJ", userObj);

    };

    return (
        <>
            <div>BudgetForm</div>
            <form>
                <fieldset>
                    <legend>Your Currency</legend>
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
                        <input type="number" value={userObj.earnings[0].amount} name={userObj.earnings[0].name} onChange={handleChange} />{`${currency}`}
                        <button /*onSubmit={deleteItem}*/>-</button>
                    </div>
                    <div className="grid">
                        <input type="text" /*value={ }*/ name="" onChange={handleChange} placeholder="name" />
                        <input type="number" /*value={ }*/ name="" onChange={handleChange} />{`${currency}`}
                        <button /*onSubmit={addItem}*/>+</button>
                    </div>
                </fieldset>
                <fieldset id="expenses">
                    <legend>Your expenses</legend>
                    <div className="grid">
                        <label>{userObj.expenses[0].name}</label>
                        <input type="number" value={userObj.expenses[0].amount} name={userObj.expenses[0].name} onChange={handleChange} />{`${currency}`}
                        <button /*onSubmit={deleteItem}*/>-</button>
                    </div>
                    <div className="grid">
                        <label>{userObj.expenses[1].name}</label>
                        <input type="number" value={userObj.expenses[1].amount} name={userObj.expenses[1].name} onChange={handleChange} />{`${currency}`}
                        <button /*onSubmit={deleteItem}*/>-</button>
                    </div>
                    <div className="grid">
                        <label>{userObj.expenses[2].name}</label>
                        <input type="number" value={userObj.expenses[2].amount} name={userObj.expenses[2].name} onChange={handleChange} />{`${currency}`}
                        <button /*onSubmit={deleteItem}*/>-</button>
                    </div>
                    <div className="grid">
                        <input type="text" /*value={ }*/ name="" onChange={handleChange} placeholder="name" />
                        <input type="number" /*value={ }*/ name="" onChange={handleChange} />{`${currency}`}
                        <button /*onSubmit={addItem}*/>+</button>
                    </div>
                </fieldset>
                <fieldset id="savings">
                    <legend>Your saving goals</legend>
                    <div className="grid">
                        <label>Horst's saving goal</label>
                        <input type="number" /*value={ }*/ name="" onChange={handleChange} />{`${currency}`}
                        <button /*onSubmit={deleteItem}*/>-</button>
                    </div>
                    <div className="grid">
                        <input type="text" /*value={ }*/ name="" onChange={handleChange} placeholder="name" />
                        <input type="number" /*value={ }*/ name="" onChange={handleChange} />{`${currency}`}
                        <button /*onSubmit={addItem}*/>+</button>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Your spending categories</legend>
                </fieldset>
                <fieldset>
                    <legend>Your monthly budget:</legend>
                    10.300,00€
                </fieldset>
            </form>
        </>
    )
}

export default BudgetForm