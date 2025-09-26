import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Plan } from '../../components/api/plans.ts';
import { PlanCategory } from '../../components/api/plan-categories.ts';
import { Button, ProgressBar } from '../../components/ui/index.ts';
import { ChevronDownIcon } from '../../components/ui/icons/chevron-down.tsx';
import {
    APIMutationCallbackFn,
    useAPICollection,
    useAPIMutation,
} from '../../components/api/api.ts';
import { PlanCategoryUsage, PlanUsage } from '../../components/api/usages.ts';
import { formatCurrency } from '../../utils/index.ts';
import {
    CreateLineItemParams,
    LineItem,
} from '../../components/api/line-items.ts';
import {
    HALCollection,
    Link,
    useHALClient,
} from '../../components/api/links.ts';
import { LoaderIcon } from '../../components/ui/icons/loader.tsx';
import { CategoryForm } from './components/category-form.tsx';
import { LineItemForm } from './components/line-item-form.tsx';

function BudgetDetails() {
    const { id } = useParams();
    if (!id) {
        return null;
    }

    const planLink: Link = { href: '/api/v1/plans/' + id };
    const client = useHALClient();

    useEffect(() => {
        client.go<Plan>({ link: planLink })
            .then((plan) => {
                client.go<HALCollection<PlanCategory>>({
                    link: plan._links['plan_categories'],
                });
                client.go<PlanUsage>({
                    link: plan._links['usage'],
                });
                client.go<HALCollection<PlanCategoryUsage>>({
                    link: plan._links['plan_categories_usage'],
                });
            });
    }, []);

    const plan = client.getResource<Plan>(planLink);
    if (!plan) return null;

    const planUsage = client.getResource<PlanUsage>(plan._links['usage']);
    if (!planUsage) return null;

    const planCategories = client.getResource<HALCollection<PlanCategory>>(
        plan._links['plan_categories'],
    );
    if (!planCategories) return null;

    const planCategoriesUsage = client.getResource<
        HALCollection<PlanCategoryUsage>
    >(plan._links['plan_categories_usage']);
    if (!planCategoriesUsage) return null;

    const categoryUsages: Record<string, PlanCategoryUsage> = {};
    planCategoriesUsage?._embedded.items.forEach((i) => {
        categoryUsages[i.plan_category_id] = i;
    });

    return (
        <div>
            <h1 className='font-bold mb-2 text-slate-500 dark:text-slate-300'>
                {plan?.name}
            </h1>
            <div className='mb-4'>
                <p className='text-sm font-bold text-slate-600 dark:text-slate-400 mb-1'>
                    Withdrawn
                </p>
                <ProgressBar
                    value={planUsage?.net_withdrawal}
                    target={planUsage?.target_withdrawal}
                    label={planUsage
                        ? formatCurrency(planUsage.net_withdrawal) + ' / ' +
                            formatCurrency(planUsage.target_withdrawal)
                        : ''}
                />
            </div>
            <div>
                <p className='text-sm font-bold text-slate-600 dark:text-slate-400 mb-1'>
                    Deposited
                </p>
                <ProgressBar
                    value={planUsage?.net_deposit}
                    target={planUsage?.target_deposit}
                    label={planUsage
                        ? formatCurrency(planUsage.net_deposit) + ' / ' +
                            formatCurrency(planUsage.target_deposit)
                        : ''}
                />
            </div>
            <div className='mt-8 mb-4 ms-auto w-max'>
                {planCategories &&
                    (
                        <CategoryForm
                            planID={id}
                            client={client}
                            create_link={planCategories._links['create']}
                            refresh_links={[
                                plan._links['self'],
                                planUsage._links['self'],
                                planCategories._links['self'],
                                planCategoriesUsage._links['self'],
                            ]}
                        />
                    )}
            </div>
            <ul className='mb-8 space-y-8'>
                {client.getResource<HALCollection<PlanCategory>>(
                    plan._links['plan_categories'],
                )?._embedded.items.map((
                    c,
                ) => (
                    <PlanCategoryItem
                        planCategory={c}
                        key={c.id}
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
    usage?: PlanCategoryUsage;
    // refetchUsages: APIMutationCallbackFn;
    // refetchPlanUsage: APIMutationCallbackFn;
}

function PlanCategoryItem(
    { planCategory, usage }: PlanCategoryItemProps,
) {
    const [open, setOpen] = useState<boolean>(false);
    const [render, setRender] = useState<boolean>(false);
    const [lineItemsLink, setLineItemsLink] = useState<Link | undefined>(
        undefined,
    );
    const {
        collection: lineItems,
        refetch: refetchLineItems,
        fetching,
        errored,
    } = useAPICollection<
        LineItem
    >(lineItemsLink);
    const { mutate: createLineItemFn } = useAPIMutation<CreateLineItemParams>(
        lineItems?._links['create'],
    );

    return (
        <li className='bg-white dark:bg-slate-800 rounded-3xl p-8'>
            <div>
                <h2 className='font-bold text-indigo-500 text-lg mb-6'>
                    {planCategory.name}
                </h2>
                <div className='mb-4'>
                    <p className='text-sm font-bold text-slate-600 dark:text-slate-400 mb-1'>
                        Withdrawn
                    </p>
                    <ProgressBar
                        value={usage?.net_withdrawal}
                        target={usage?.target_withdrawal}
                        label={usage
                            ? formatCurrency(usage.net_withdrawal) + ' / ' +
                                formatCurrency(usage.target_withdrawal)
                            : ''}
                    />
                </div>
                <div>
                    <p className='text-sm font-bold text-slate-600 dark:text-slate-400 mb-1'>
                        Deposited
                    </p>
                    <ProgressBar
                        value={usage?.net_deposit}
                        target={usage?.target_deposit}
                        label={usage
                            ? formatCurrency(usage.net_deposit) + ' / ' +
                                formatCurrency(usage.target_deposit)
                            : ''}
                    />
                </div>
                <div className='flex justify-between items-center gap-3 mt-4'>
                    <LineItemForm
                        planCategoryID={planCategory.id}
                        planCategoryName={planCategory.name}
                        mutationFn={createLineItemFn}
                        callbacks={[
                            refetchLineItems,
                            // refetchUsages,
                            // refetchPlanUsage,
                        ]}
                    />
                    <Button
                        variant='ghost'
                        onClick={() => {
                            if (!open) {
                                setRender(true);
                                setLineItemsLink(
                                    planCategory._links['line_items'],
                                );
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
                            className='size-5 data-[open=true]:rotate-180 transition-transform ms-2'
                        />
                    </Button>
                </div>
            </div>
            {render &&
                (
                    <div
                        data-open={open}
                        className='grid data-[open=false]:grid-rows-[0fr] data-[open=true]:grid-rows-[1fr] transition-[grid-template-rows] overflow-hidden'
                    >
                        <div className='overflow-hidden'>
                            <div>
                                {errored && (
                                    <p>
                                        Couldn't retrieve line items. Retry
                                        later.
                                    </p>
                                )}
                                {fetching && (
                                    <p className='flex items-center gap-2 animate-pulse justify-center'>
                                        <LoaderIcon className='animate-spin size-5' />
                                        Loading line items...
                                    </p>
                                )}
                                {lineItems &&
                                    (
                                        <table className='w-full'>
                                            <thead>
                                                <tr className='text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400'>
                                                    <th className='w-full p-4'>
                                                        DESCRIPTION
                                                    </th>
                                                    <th className='p-4'>
                                                        DEPOSIT
                                                    </th>
                                                    <th className='p-4'>
                                                        WITHDRAWAL
                                                    </th>
                                                    <th className='p-4'>
                                                        DATE
                                                    </th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lineItems._embedded.items?.map(
                                                    (l) => (
                                                        <LineItemRow
                                                            key={l.id}
                                                            lineItem={l}
                                                            callbacks={[
                                                                refetchLineItems,
                                                                // refetchUsages,
                                                                // refetchPlanUsage,
                                                            ]}
                                                        />
                                                    ),
                                                )}
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

interface LineItemProps {
    lineItem: LineItem;
    callbacks: APIMutationCallbackFn[];
}

function LineItemRow({ lineItem, callbacks }: LineItemProps) {
    const { mutate } = useAPIMutation<LineItem>(lineItem._links['revert']);

    return (
        <tr>
            <td className='w-full p-4'>{lineItem.description}</td>
            <td className={`p-4 ${lineItem.deposit > 0 && 'text-lime-600'}`}>
                {formatCurrency(lineItem.deposit)}
            </td>
            <td className={`p-4 ${lineItem.withdrawal > 0 && 'text-red-600'}`}>
                {formatCurrency(lineItem.withdrawal)}
            </td>
            <td className='p-4 text-nowrap'>
                {(new Date(lineItem.created_at)).toLocaleDateString()}
            </td>
            <td>
                <Button
                    variant='outline'
                    onClick={async () =>
                        await mutate({
                            updatedDat: {
                                description: lineItem.description +
                                    ' (reverted)',
                            },
                            callback: callbacks,
                        })}
                >
                    Revert
                </Button>
            </td>
        </tr>
    );
}

export default BudgetDetails;
