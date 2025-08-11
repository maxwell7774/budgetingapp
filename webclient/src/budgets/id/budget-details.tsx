import { useParams } from "react-router";
import { usePlan } from "../../components/api/plans.ts";
import { usePlanCategories } from "../../components/api/plan-categories.ts";
import { useLineItems } from "../../components/api/line-items.ts";
import { Button, Select } from "../../components/ui/index.ts";
import { Input } from "../../components/ui/input.tsx";

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
      <form className="flex gap-8">
        <Input />
        <Select />
        <Button>Add</Button>
      </form>
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
