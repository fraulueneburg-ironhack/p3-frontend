import BudgetForm from "../components/BudgetForm";

function BudgetOverview() {
  return (
    <>
      <h1>Your weekly budget</h1>
      <p>You don’t have a weekly budget yet. Set up your account here:</p>
      <BudgetForm />
    </>
  );
}

export default BudgetOverview;
