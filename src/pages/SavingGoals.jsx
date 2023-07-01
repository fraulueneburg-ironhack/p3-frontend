import { useState } from 'react'
import savingsGif from "../assets/gif-no-savings.gif"

import SavingGoalsForm from "../components/SavingGoalsForm"

function SavingGoals() {
    return (
        <>
            <h1>Your current Saving Goals:</h1>
            <SavingGoalsForm />
        </>
    )
}

export default SavingGoals