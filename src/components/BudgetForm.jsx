import { useState } from 'react'
import BudgetFormFieldset from './BudgetFormFieldset'

function BudgetForm() {

    const [userObj, setUserObj] = useState({
        currency: '€',
        earnings: [
            { name: 'monthly earnings', amount: 0 },
            { name: 'salary', amount: 0 },
            { name: 'illegal casino', amount: 0 },
        ],
        expenses: [
            { name: 'rent', amount: 0 },
            { name: 'electricity', amount: 0 },
            { name: 'heating', amount: 0 },
        ],
        savingGoals: [
            { name: 'My saving goal', amount: 0 },
            { name: 'My saving goal 2', amount: 0 },
            { name: 'My saving goal 3', amount: 0 },
        ],
    })

    const handleChange = (e, index) => {
        let parent = e.target.parentElement.parentElement.id
        let inputIndex;
        index === undefined ? inputIndex = userObj[parent].length : inputIndex = index;
        let inputName = e.target.name
        let inputValue = e.target.value

        if (inputName === 'currency') {
            setUserObj({ ...userObj, [inputName]: inputValue })
        } else {
            //setUserObj({ ...userObj, [parent]: { ...userObj[parent], [inputIndex]: { name: inputName, amount: inputValue } } })
            setUserObj({ ...userObj, parent: { ...userObj[parent], [inputIndex]: { name: inputName, amount: inputValue } } })
        }
        console.log("USEROBJ", userObj);
    }

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
                <BudgetFormFieldset data={userObj} index={1} handleChange={handleChange} />
                <BudgetFormFieldset data={userObj} index={2} handleChange={handleChange} />
                <BudgetFormFieldset data={userObj} index={3} handleChange={handleChange} />
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




// console.log("PARENT:", parent);
// console.log("INPUT INDEX:", inputIndex);
// console.log("INPUT NAME:", inputName);
// console.log("VALUE:", inputValue);

//setUserObj({ ...userObj, [parent]: { ...userObj[parent], 0: { name: inputName, amount: inputValue } } })
//setUserObj({ ...userObj, something: { indexIs: index, parent: parent, name: inputName, amount: inputValue } })