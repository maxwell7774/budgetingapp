import { useParams } from "react-router";
import { usePlan } from "../../components/api/plans.ts";
import { usePlanCategories } from "../../components/api/plan-categories.ts";

function BudgetDetails() {
  const { id } = useParams();
  if (!id) {
    return null;
  }
  const plan = usePlan(id);
  const planCategories = usePlanCategories(id);

  return (
    <div>
      <h1>{plan?.name}</h1>
      <ul>
        {planCategories.map((c) => <li key={c.id}>{c.name}</li>)}
      </ul>
    </div>
  );
}

export default BudgetDetails;
