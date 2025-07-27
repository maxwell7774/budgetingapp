import { Plan, useCreatePlan, usePlans } from "../components/api/plans.ts";
import { NavLink } from "react-router";
import Button from "../components/ui/Button.tsx";
import Input from "../components/ui/Input.tsx";

function Budgets() {
  const plans = usePlans();
  const createPlan = useCreatePlan();

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const planName = formData.get("plan_name") as string;

    await createPlan({
      name: planName,
    });
  };

  return (
    <div>
      <p>Budgets</p>
      <div className="grid grid-cols-3 gap-8 mb-8">
        {plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 shadow-md mx-auto max-w-xl p-10 rounded-3xl space-y-8 mt-32"
      >
        <h2 className="text-lg font-bold text-indigo-500">Create Plan</h2>
        <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
          Plan Name
        </label>
        <Input
          name="plan_name"
          type="text"
          className="dark:bg-slate-900"
          placeholder="type here..."
        />
        <Button type="submit">Add Plan</Button>
      </form>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
}

function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="p-8 bg-white dark:bg-slate-800 shadow-md rounded-3xl">
      <NavLink
        to={`/budgets/${plan.id}`}
        className="text-indigo-500 text-lg font-bold mb-2 hover:opacity-80 active:opacity-60 transition-opacity"
      >
        {plan.name}
      </NavLink>
      <p className="ms-auto w-fit italic text-sm text-slate-400">
        Updated at {new Date(plan.updated_at).toLocaleString()}
      </p>
    </div>
  );
}

export default Budgets;
