import { ProgressBar } from '@/components/ui/progress-bar-temp';
import { api } from '@/lib/api';
import { Collection, PlanCategory, PlanCategoryUsage } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { CreateCategoryDialog } from './create-category-dialog';
import { createPlanCategory } from '@/lib/api/plan-category-actions';
import { Fragment } from 'react';

interface Props {
    planID: string;
}

async function fetchPlanCategories(
    planID: string
): Promise<Collection<PlanCategory>> {
    const res = await api.fetch(`/api/v1/plan-categories?plan_id=${planID}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch plan: ${res.status}`);
    }
    const category: Collection<PlanCategory> = await res.json();
    return category;
}

async function fetchPlanCategoriesUsage(
    planID: string
): Promise<Collection<PlanCategoryUsage>> {
    const res = await api.fetch(
        `/api/v1/plan-categories/usage?plan_id=${planID}`
    );
    if (!res.ok) {
        throw new Error(`Failed to fetch plan usage: ${res.status}`);
    }
    const usage: Collection<PlanCategoryUsage> = await res.json();
    return usage;
}

export async function BudgetCategoriesList({ planID }: Props) {
    const [planCategories, planCategoriesUsage] = await Promise.all([
        fetchPlanCategories(planID),
        fetchPlanCategoriesUsage(planID),
    ]);

    console.log(planCategoriesUsage);

    const categoryUsages: Record<string, PlanCategoryUsage> = {};
    planCategoriesUsage._embedded.items.forEach(
        (u) => (categoryUsages[u.plan_category_id] = u)
    );

    return (
        <div>
            <div className="mt-8 mb-4 ms-auto w-max">
                <CreateCategoryDialog
                    planID={planID}
                    createPlanCategory={createPlanCategory}
                />
                {/* {planCategories && ( */}
                {/*     <CategoryForm */}
                {/*         planID={id} */}
                {/*         client={client} */}
                {/*         create_link={planCategories._links['create']} */}
                {/*         refresh_links={[ */}
                {/*             plan._links['self'], */}
                {/*             planUsage._links['self'], */}
                {/*             planCategories._links['self'], */}
                {/*             planCategoriesUsage._links['self'], */}
                {/*         ]} */}
                {/*     /> */}
                {/* )} */}
            </div>
            {/* <Fragment key={c.id}> */}
            {/*     <li> */}
            {/*         <span className="text-red-500">{c.name}</span> */}
            {/*         {JSON.stringify(c)} */}
            {/*     </li> */}
            {/*     <li> */}
            {/*         <span className="text-green-500">usage: </span> */}
            {/*         {JSON.stringify(categoryUsages[c.id])} */}
            {/*     </li> */}
            {/* </Fragment> */}
            <ul className="mb-8 space-y-8">
                {planCategories._embedded.items.map((c) => (
                    <PlanCategoryItem
                        key={c.id}
                        planCategory={c}
                        usage={categoryUsages[c.id]}
                        // refetchUsages={refectUsages}
                        // refetchPlanUsage={refectPlanUsage}
                    />
                ))}
            </ul>
        </div>
    );
}

interface PlanCategoryItemProps {
    planCategory: PlanCategory;
    usage: PlanCategoryUsage;
}

function PlanCategoryItem({ planCategory, usage }: PlanCategoryItemProps) {
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
                        value={usage.net_withdrawal}
                        target={usage.target_withdrawal}
                        label={
                            usage
                                ? formatCurrency(usage.net_withdrawal) +
                                  ' / ' +
                                  formatCurrency(usage.target_withdrawal)
                                : ''
                        }
                    />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Deposited
                    </p>
                    <ProgressBar
                        value={usage?.net_deposit}
                        target={usage?.target_deposit}
                        label={
                            usage
                                ? formatCurrency(usage.net_deposit) +
                                  ' / ' +
                                  formatCurrency(usage.target_deposit)
                                : ''
                        }
                    />
                </div>
                {/* <div className="flex justify-between items-center gap-3 mt-4"> */}
                {/*     <LineItemForm */}
                {/*         planCategoryID={planCategory.id} */}
                {/*         planCategoryName={planCategory.name} */}
                {/*         mutationFn={createLineItemFn} */}
                {/*         callbacks={[ */}
                {/*             refetchLineItems, */}
                {/*             // refetchUsages, */}
                {/*             // refetchPlanUsage, */}
                {/*         ]} */}
                {/*     /> */}
                {/*     <Button */}
                {/*         variant="ghost" */}
                {/*         onClick={() => { */}
                {/*             if (!open) { */}
                {/*                 setRender(true); */}
                {/*                 setLineItemsLink( */}
                {/*                     planCategory._links['line_items'] */}
                {/*                 ); */}
                {/*                 requestAnimationFrame(() => setOpen(true)); */}
                {/*             } else { */}
                {/*                 setOpen(false); */}
                {/*                 setTimeout(() => setRender(false), 150); */}
                {/*             } */}
                {/*         }} */}
                {/*     > */}
                {/*         Line Items */}
                {/*         <ChevronDownIcon */}
                {/*             data-open={open} */}
                {/*             className="size-5 data-[open=true]:rotate-180 transition-transform ms-2" */}
                {/*         /> */}
                {/*     </Button> */}
                {/* </div> */}
            </div>
            {/* {render && ( */}
            {/*     <div */}
            {/*         data-open={open} */}
            {/*         className="grid data-[open=false]:grid-rows-[0fr] data-[open=true]:grid-rows-[1fr] transition-[grid-template-rows] overflow-hidden" */}
            {/*     > */}
            {/*         <div className="overflow-hidden"> */}
            {/*             <div> */}
            {/*                 {errored && ( */}
            {/*                     <p> */}
            {/*                         Couldn't retrieve line items. Retry later. */}
            {/*                     </p> */}
            {/*                 )} */}
            {/*                 {fetching && ( */}
            {/*                     <p className="flex items-center gap-2 animate-pulse justify-center"> */}
            {/*                         <LoaderIcon className="animate-spin size-5" /> */}
            {/*                         Loading line items... */}
            {/*                     </p> */}
            {/*                 )} */}
            {/*                 {lineItems && ( */}
            {/*                     <table className="w-full"> */}
            {/*                         <thead> */}
            {/*                             <tr className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400"> */}
            {/*                                 <th className="w-full p-4"> */}
            {/*                                     DESCRIPTION */}
            {/*                                 </th> */}
            {/*                                 <th className="p-4">DEPOSIT</th> */}
            {/*                                 <th className="p-4">WITHDRAWAL</th> */}
            {/*                                 <th className="p-4">DATE</th> */}
            {/*                                 <th></th> */}
            {/*                             </tr> */}
            {/*                         </thead> */}
            {/*                         <tbody> */}
            {/*                             {lineItems._embedded.items?.map((l) => ( */}
            {/*                                 <LineItemRow */}
            {/*                                     key={l.id} */}
            {/*                                     lineItem={l} */}
            {/*                                     callbacks={[ */}
            {/*                                         refetchLineItems, */}
            {/*                                         // refetchUsages, */}
            {/*                                         // refetchPlanUsage, */}
            {/*                                     ]} */}
            {/*                                 /> */}
            {/*                             ))} */}
            {/*                         </tbody> */}
            {/*                     </table> */}
            {/*                 )} */}
            {/*             </div> */}
            {/*         </div> */}
            {/*     </div> */}
            {/* )} */}
        </li>
    );
}
