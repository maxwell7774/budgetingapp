import {
  Plan,
  useCreatePlan,
  useDeletePlan,
  usePlans,
} from "../components/api/plans.ts";
import { Link } from "react-router";
import { SearchIcon } from "../components/ui/icons/index.ts";
import { Button, Input } from "../components/ui/index.ts";
import { Pagination } from "../components/ui/pagination.tsx";
import { TrashIcon } from "../components/ui/icons/trash.tsx";

function Budgets() {
  const { collection, selectLink, refetch, fetching } = usePlans();
  const createPlan = useCreatePlan(collection?._links["create"]);
  console.log(fetching);

  if (!collection) {
    return <div className="animate-puse">Loading plans...</div>;
  }

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const planName = formData.get("plan_name") as string;

    await createPlan.mutate(
      {
        updatedDat: {
          name: planName,
        },
        callback: refetch,
      },
    );
  };

  const handleSearch = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    selectLink("filter", { "search": [name] });
  };

  return (
    <div>
      <div className="flex justify-between text-slate-500 dark:text-slate-300 items-end">
        <h1 className="font-bold mb-2">
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
          <PlanCard key={plan.id} plan={plan} refetchCollection={refetch} />
        ))}
      </div>
      <Pagination collection={collection} selectLink={selectLink} />
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
  refetchCollection: () => void;
}

function PlanCard({ plan, refetchCollection }: PlanCardProps) {
  const { mutate } = useDeletePlan(plan._links["delete"]);

  const deletePlan = async function () {
    await mutate({ callback: refetchCollection });
  };

  return (
    <div className="p-8 bg-white dark:bg-slate-800 shadow-md rounded-3xl">
      <div className="mb-16 flex items-baseline justify-between gap-3">
        <Link
          to={`/budgets/${plan.id}`}
          className="text-indigo-500 text-lg font-bold hover:opacity-80 active:opacity-60 transition-opacity"
        >
          {plan.name}
        </Link>
        <Button variant="ghost" onClick={deletePlan}>
          <TrashIcon className="size-5" />
        </Button>
      </div>
      <p className="ms-auto w-fit italic text-sm text-slate-400">
        Updated at {new Date(plan.updated_at).toLocaleString()}
      </p>
    </div>
  );
}

export default Budgets;
