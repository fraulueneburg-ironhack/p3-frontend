import BudgetForm from "../components/BudgetForm";
import DailyExpensesForm from "../components/DailyExpensesForm";

function BudgetOverview() {
  return (
    <>
      <h1>---------- IF NO BUDGET: ----------<br />
        Your weekly budget:
      </h1>
      <p>You don’t have a weekly budget yet. Set up your account here:</p>
      <BudgetForm />

      <br /><br /><br />

      <h1>---------- IF BUDGET EXISTS: ----------<br />
        Your weekly budget:
      </h1>
      <div className="card">
        <big>0,00 €</big>
      </div>
      <DailyExpensesForm />
    </>
  );
}

export default BudgetOverview;
