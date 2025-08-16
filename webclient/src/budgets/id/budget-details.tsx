import { useState } from "react";
import { useParams } from "react-router";
import { usePlan } from "../../components/api/plans.ts";
import { usePlanCategories } from "../../components/api/plan-categories.ts";
import { useLineItems } from "../../components/api/line-items.ts";
import { Button, Dialog, Select } from "../../components/ui/index.ts";
import { Input } from "../../components/ui/input.tsx";

function BudgetDetails() {
  const { id } = useParams();
  if (!id) {
    return null;
  }
  const [open, setOpen] = useState<boolean>(false);
  const { resource: plan } = usePlan(id);
  const { collection: planCategories } = usePlanCategories(id);
  const { collection: lineItems } = useLineItems(id);
  const [value, setValue] = useState<string | number>("");

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <h1>{plan?.name}</h1>
      <form className="flex gap-8">
        <Input />
        <Select
          options={planCategories?._embedded.items.map((p) => {
            return { label: p.name, value: p.id };
          })}
          value={value}
          onChange={setValue}
        />
        <Button>Add</Button>
      </form>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Dialog open={open} onClose={handleClose}>
        <div className="max-w-7xl w-full m-auto">
          <h1>Hello</h1>
        </div>
      </Dialog>
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
