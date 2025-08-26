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
import { useAPICollection } from "../components/api/api.ts";
import { PlanUsage } from "../components/api/usages.ts";
import { useMemo } from "react";

function Budgets() {
  const { collection, selectLink, refetch, fetching, errored } = usePlans();
  const createPlan = useCreatePlan(collection?._links["create"]);
  const { collection: usages } = useAPICollection<PlanUsage>(
    collection?._links["usage"],
  );

  const planUsages = useMemo(() => {
    const map: Record<string, PlanUsage> = {};
    usages?._embedded.items.forEach((i) => {
      map[i.plan_id] = i;
    });
    return map;
  }, [usages]);

  if (!collection) {
    return null;
  }

  if (errored) {
    return <div className="text-red-500">Failed to load plans.</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const planName = formData.get("plan_name") as string;

    try {
      await createPlan.mutate({
        updatedDat: { name: planName },
        callback: refetch,
      });
      e.currentTarget.reset();
    } catch {
      // errors should be surfaced in createPlan.errored as well
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    selectLink("filter", { search: [name] });
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

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
              {fetching
                ? <LoaderIcon className="animate-spin w-full" />
                : <SearchIcon className="w-full" />}
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
        {/* Could scroll into view of the form, or open a modal */}
        <Button
          onClick={() =>
            document.getElementById("create-plan-form")?.scrollIntoView({
              behavior: "smooth",
            })}
        >
          New Plan
        </Button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(24rem,1fr))] gap-8 mb-8">
        {collection?._embedded.items.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            planUsage={planUsages[plan.id]}
            refetchCollection={refetch}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      <Pagination collection={collection} selectLink={selectLink} />

      <form
        id="create-plan-form"
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 shadow-md mx-auto max-w-xl p-10 rounded-3xl space-y-8 mt-32"
      >
        <h2 className="text-lg font-bold text-indigo-500">Create Plan</h2>
        <label
          htmlFor="plan-name"
          className="block mb-1 font-bold text-slate-800 dark:text-slate-200"
        >
          Plan Name
        </label>
        <Input
          id="plan-name"
          name="plan_name"
          type="text"
          className="dark:bg-slate-900"
          placeholder="type here..."
          required
        />
        <Button type="submit">Add Plan</Button>
      </form>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  planUsage?: PlanUsage;
  refetchCollection: () => void;
  formatCurrency: (val: number) => string;
}

function PlanCard({
  plan,
  planUsage,
  refetchCollection,
  formatCurrency,
}: PlanCardProps) {
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
            label={planUsage
              ? formatCurrency(planUsage.net_withdrawal) + " / " +
                formatCurrency(planUsage.target_withdrawal)
              : ""}
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
            Deposited
          </p>
          <ProgressBar
            value={planUsage?.net_deposit}
            target={planUsage?.target_deposit}
            label={planUsage
              ? formatCurrency(planUsage.net_deposit) + " / " +
                formatCurrency(planUsage.target_deposit)
              : ""}
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
