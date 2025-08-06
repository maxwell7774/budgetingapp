import { Plan, useCreatePlan, usePlans } from "../components/api/plans.ts";
import { Link } from "react-router";
import { SearchIcon } from "../components/ui/icons/index.ts";
import { Button, Input } from "../components/ui/index.ts";
import { Pagination } from "../components/ui/pagination.tsx";

function Budgets() {
  const { collection, setLink } = usePlans();
  const createPlan = useCreatePlan();

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const planName = formData.get("plan_name") as string;

    await createPlan({
      name: planName,
    });
  };

  const handleSearch = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    setLink({ href: `/api/v1/plans?search=${name}` });
  };

  if (!collection) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between border-b text-slate-500 dark:text-slate-300 items-end">
        <h1 className="text-2xl font-bold mb-2">
          Budget Plans
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 mb-3"
        >
          <div className="relative max-w-96 w-full">
            <div className="absolute left-3 w-5 h-full grid place-content-center">
              <SearchIcon className="w-full" />
            </div>
            <Input
              className="ps-10"
              name="name"
              placeholder="Search plan name..."
            />
          </div>
          <Button variant="outline">Search</Button>
        </form>
      </div>
      <div className="ms-auto my-8 w-max">
        <Button>New Plan</Button>
      </div>
      <div className="grid grid-cols-3 gap-8 mb-8">
        {collection._embedded.items.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
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
      <Pagination collection={collection} setLink={setLink} />
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
}

function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="p-8 bg-white dark:bg-slate-800 shadow-md rounded-3xl">
      <Link
        to={`/budgets/${plan.id}`}
        className="text-indigo-500 text-lg font-bold mb-8 hover:opacity-80 active:opacity-60 transition-opacity flex gap-2 items-center"
      >
        {plan.name}
      </Link>
      <p className="ms-auto w-fit italic text-sm text-slate-400">
        Updated at {new Date(plan.updated_at).toLocaleString()}
      </p>
    </div>
  );
}

export default Budgets;
