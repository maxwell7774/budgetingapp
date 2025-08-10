import { useParams } from "react-router";
import { usePlan } from "../../components/api/plans.ts";
import { usePlanCategories } from "../../components/api/plan-categories.ts";
import { useLineItems } from "../../components/api/line-items.ts";

function BudgetDetails() {
  const { id } = useParams();
  if (!id) {
    return null;
  }
  const { resource: plan } = usePlan(id);
  const { collection: planCategories } = usePlanCategories(id);
  const { collection: lineItems } = useLineItems(id);

  return (
    <div>
      <h1>{plan?.name}</h1>
      <ul>
        {planCategories?._embedded.items.map((c) => <li key={c.id}>{c.name}
        </li>)}
        {lineItems?._embedded.items.map((l) => (
          <li key={l.id}>{l.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default BudgetDetails;
