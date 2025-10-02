import {
  Plan,
  useCreatePlan,
  useDeletePlan,
  usePlans,
} from "../components/api/plans.ts";
import { Link } from "react-router";
import {
  LoaderIcon,
  SearchIcon,
  TrashIcon,
} from "../components/ui/icons/index.ts";
import {
  Button,
  Input,
  Pagination,
  ProgressBar,
} from "../components/ui/index.ts";
import { useAPICollection, useAPIMutation } from "../components/api/api.ts";
import { PlanUsage } from "../components/api/usages.ts";
import { formatCurrency } from "../utils/index.ts";
import { PlanForm } from "./components/plan-form.tsx";

function Budgets() {
  const { collection, selectLink, refetch, fetching, errored } = usePlans();
  const { mutate: createPlan } = useAPIMutation<Plan>(
    collection?._links["create"],
  );
  const { collection: usages, refetch: refetchUsages } =
    useAPICollection<PlanUsage>(collection?._links["usage"]);

  const planUsages: Record<string, PlanUsage> = {};
  usages?._embedded.items.forEach((i) => {
    planUsages[i.plan_id] = i;
  });

  if (!collection) {
    return null;
  }

  if (errored) {
    return <div className="text-red-500">Failed to load plans.</div>;
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    selectLink("filter", { search: [name] });
  };

  return (
    <div>
      <div className="flex justify-between text-slate-500 dark:text-slate-300 items-end">
        <h1 className="font-bold mb-2">Budget Plans</h1>
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-3">
          <div className="relative max-w-96 w-full">
            <label htmlFor="plan-search" className="sr-only">
              Search plan name
            </label>
            <div className="absolute left-3 w-5 h-full grid place-content-center">
              {fetching ? (
                <LoaderIcon className="animate-spin w-full" />
              ) : (
                <SearchIcon className="w-full" />
              )}
            </div>
            <Input
              id="plan-search"
              className="bg-white ps-10"
              name="name"
              placeholder="Search plan name..."
            />
          </div>
          <Button variant="outline">Search</Button>
        </form>
      </div>
      <div className="ms-auto my-8 w-max">
        <PlanForm
          mutationFn={createPlan}
          callbacks={[refetch, refetchUsages]}
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(24rem,1fr))] gap-8 mb-8">
        {collection?._embedded.items.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            planUsage={planUsages[plan.id]}
            refetchCollection={refetch}
          />
        ))}
      </div>
      <Pagination collection={collection} selectLink={selectLink} />
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  planUsage?: PlanUsage;
  refetchCollection: () => void;
}

function PlanCard({ plan, planUsage, refetchCollection }: PlanCardProps) {
  const { mutate } = useDeletePlan(plan._links["delete"]);

  const deletePlan = async () => {
    await mutate({ callback: refetchCollection });
  };

  return (
    <div className="p-8 bg-white dark:bg-slate-800 shadow-md rounded-3xl">
      <div className="mb-6 flex items-baseline justify-between gap-3">
        <Link
          to={`/budgets/${plan.id}`}
          className="text-indigo-500 text-lg font-bold hover:opacity-80 active:opacity-60 transition-opacity"
        >
          {plan.name}
        </Link>
        <Button variant="ghost" onClick={deletePlan} aria-label="Delete plan">
          <TrashIcon className="size-5" />
        </Button>
      </div>
      <div className="mb-6 space-y-4">
        <div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
            Withdrawn
          </p>
          <ProgressBar
            value={planUsage?.net_withdrawal}
            target={planUsage?.target_withdrawal}
            label={
              planUsage
                ? formatCurrency(planUsage.net_withdrawal) +
                  " / " +
                  formatCurrency(planUsage.target_withdrawal)
                : ""
            }
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
            Deposited
          </p>
          <ProgressBar
            value={planUsage?.net_deposit}
            target={planUsage?.target_deposit}
            label={
              planUsage
                ? formatCurrency(planUsage.net_deposit) +
                  " / " +
                  formatCurrency(planUsage.target_deposit)
                : ""
            }
          />
        </div>
      </div>
      <p className="ms-auto w-fit italic text-sm text-slate-400">
        Updated at {new Date(plan.updated_at).toLocaleString()}
      </p>
    </div>
  );
}

export default Budgets;
