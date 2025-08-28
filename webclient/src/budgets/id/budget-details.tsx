import { FormEventHandler, useState } from "react";
import { useParams } from "react-router";
import { usePlan } from "../../components/api/plans.ts";
import {
  PlanCategory,
  usePlanCategories,
} from "../../components/api/plan-categories.ts";
import {
  Button,
  Input,
  ProgressBar,
  Select,
} from "../../components/ui/index.ts";
import { ChevronDownIcon } from "../../components/ui/icons/chevron-down.tsx";
import {
  useAPICollection,
  useAPIMutation,
  useAPIResource,
} from "../../components/api/api.ts";
import { PlanCategoryUsage, PlanUsage } from "../../components/api/usages.ts";
import { formatCurrency } from "../../utils/index.ts";
import { LineItem } from "../../components/api/line-items.ts";
import { Link } from "../../components/api/links.ts";
import { LoaderIcon } from "../../components/ui/icons/loader.tsx";

function BudgetDetails() {
  const { id } = useParams();
  if (!id) {
    return null;
  }
  const [newCategoryType, setNewCategoryType] = useState<string>("");
  const { resource: plan } = usePlan(id);
  const { collection: planCategories, refetch: refetchPlanCategories } =
    usePlanCategories(id);
  const { resource: planUsage } = useAPIResource<PlanUsage>(
    plan?._links["usage"],
  );
  const { collection: usages } = useAPICollection<PlanCategoryUsage>(
    plan?._links["plan_categories_usage"],
  );
  const { mutate } = useAPIMutation<PlanCategory>(
    planCategories?._links["create"],
  );

  const categoryUsages: Record<string, PlanCategoryUsage> = {};
  usages?._embedded.items.forEach((i) => {
    categoryUsages[i.plan_category_id] = i;
  });

  const handleSubmitNewCategory = async function (
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const amount = Number(formData.get("amount") as string);

    const newCategory = await mutate({
      updatedDat: {
        name: name,
        plan_id: plan?.id,
        deposit: newCategoryType === "deposit" ? amount : 0,
        withdrawal: newCategoryType === "withdrawal" ? amount : 0,
      },
      callback: refetchPlanCategories,
    });
  };

  return (
    <div>
      <h1 className="font-bold mb-2 text-slate-500 dark:text-slate-300">
        {plan?.name}
      </h1>
      <div className="mb-4">
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
      <form
        className="flex justify-between gap-4"
        onSubmit={handleSubmitNewCategory}
      >
        <div>
          <label>Category Name</label>
          <Input name="name" type="text" placeholder="type text here..." />
        </div>
        <div>
          <label>Amount</label>
          <Input name="amount" type="number" placeholder="type text here..." />
        </div>
        <div>
          <label>Type</label>
          <div>
            <Select
              onChange={(newValue: string | number) =>
                setNewCategoryType(newValue as string)}
              value={newCategoryType}
              options={[
                { label: "Deposit", value: "deposit" },
                { label: "Withdrawal", value: "withdrawal" },
              ]}
            />
          </div>
        </div>
        <div className="mt-auto">
          <Button type="submit">Add Category</Button>
        </div>
      </form>
      <ul className="my-8 space-y-8">
        {planCategories?._embedded.items.map((c) => (
          <PlanCategoryItem
            planCategory={c}
            key={c.id}
            usage={categoryUsages[c.id]}
          />
        ))}
      </ul>
    </div>
  );
}

interface PlanCategoryItemProps {
  planCategory: PlanCategory;
  usage?: PlanCategoryUsage;
}

function PlanCategoryItem({ planCategory, usage }: PlanCategoryItemProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [render, setRender] = useState<boolean>(false);
  const [lineItemsLink, setLineItemsLink] = useState<Link | undefined>(
    undefined,
  );
  const { collection: lineItems, fetching, errored } = useAPICollection<
    LineItem
  >(lineItemsLink);

  return (
    <li className="bg-white dark:bg-slate-800 rounded-3xl p-8">
      <div>
        <h2 className="font-bold text-indigo-500 text-lg mb-6">
          {planCategory.name}
        </h2>
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
            Withdrawn
          </p>
          <ProgressBar
            value={usage?.net_withdrawal}
            target={usage?.target_withdrawal}
            label={usage
              ? formatCurrency(usage.net_withdrawal) + " / " +
                formatCurrency(usage.target_withdrawal)
              : ""}
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
            Deposited
          </p>
          <ProgressBar
            value={usage?.net_deposit}
            target={usage?.target_deposit}
            label={usage
              ? formatCurrency(usage.net_deposit) + " / " +
                formatCurrency(usage.target_deposit)
              : ""}
          />
        </div>
        <div className="w-max ms-auto mt-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (!open) {
                setRender(true);
                setLineItemsLink(planCategory._links["line_items"]);
                requestAnimationFrame(() => setOpen(true));
              } else {
                setOpen(false);
                setTimeout(() => setRender(false), 150);
              }
            }}
          >
            Line Items
            <ChevronDownIcon
              data-open={open}
              className="size-5 data-[open=true]:rotate-180 transition-transform ms-2"
            />
          </Button>
        </div>
      </div>
      {render &&
        (
          <div
            data-open={open}
            className="grid data-[open=false]:grid-rows-[0fr] data-[open=true]:grid-rows-[1fr] transition-[grid-template-rows] overflow-hidden"
          >
            <div className="overflow-hidden">
              <div>
                {errored && (
                  <p>
                    Couldn't retrieve line items. Retry later.
                  </p>
                )}
                {fetching && (
                  <p className="flex items-center gap-2 animate-pulse justify-center">
                    <LoaderIcon className="animate-spin size-5" />
                    Loading line items...
                  </p>
                )}
                {lineItems &&
                  (
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">
                          <th className="w-full p-4">DESCRIPTION</th>
                          <th className="p-4">DEPOSIT</th>
                          <th className="p-4">WITHDRAWAL</th>
                          <th className="p-4">DATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems._embedded.items?.map((l) => (
                          <tr key={l.id}>
                            <td className="w-full p-4">{l.description}</td>
                            <td
                              className={`p-4 ${
                                l.deposit > 0 && "text-lime-600"
                              }`}
                            >
                              {formatCurrency(l.deposit)}
                            </td>
                            <td
                              className={`p-4 ${
                                l.withdrawal > 0 && "text-red-600"
                              }`}
                            >
                              {formatCurrency(l.withdrawal)}
                            </td>
                            <td className="p-4 text-nowrap">
                              {(new Date(l.created_at)).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
              </div>
            </div>
          </div>
        )}
    </li>
  );
}

export default BudgetDetails;
