import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { Collection, Plan, PlanUsage } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { BudgetUsageDonut } from './budget-usage-donut';

async function fetchPlans(): Promise<Collection<Plan>> {
    const res = await api.fetch('/api/v1/plans');
    if (!res.ok) {
        throw new Error(`Failed to fetch plans: ${res.status}`);
    }
    const plans: Collection<Plan> = await res.json(); // Or validate with Zod.parse(await res.json())
    return plans;
}

async function fetchPlanUsages(): Promise<Collection<PlanUsage>> {
    const res = await api.fetch('/api/v1/plans/usage');
    if (!res.ok) {
        throw new Error(`Failed to fetch plan usages: ${res.status}`);
    }
    const planUsages: Collection<PlanUsage> = await res.json();
    return planUsages;
}

export async function BudgetCardGrid() {
    const [plans, planUsages] = await Promise.all([
        fetchPlans(),
        fetchPlanUsages(),
        // new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);

    const planUsagesLookup: Record<string, PlanUsage> = {};
    planUsages._embedded.items.forEach(
        (u) => (planUsagesLookup[u.plan_id] = u)
    );

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(24rem,1fr))] gap-8">
            {plans._embedded.items.map((p) => (
                <BudgetCard
                    key={p.id}
                    plan={p}
                    usage={planUsagesLookup[p.id]}
                />
            ))}
        </div>
    );
}

interface BudgetCardProps {
    plan: Plan;
    usage: PlanUsage;
}

function BudgetCard({ plan, usage }: BudgetCardProps) {
    return (
        <Card>
            <Link
                href={`budgets/${plan.id}`}
                className="text-lg text-bold text-indigo-500 hover:opacity-80 transition-opacity"
            >
                {plan.name}
            </Link>
            <div className="mt-4 mb-6 space-y-4"></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <BudgetUsageDonut
                    chartType="deposit"
                    net={usage.net_deposit}
                    target={usage.target_deposit}
                />
                <BudgetUsageDonut
                    chartType="withdrawal"
                    net={usage.net_withdrawal}
                    target={usage.target_withdrawal}
                />
            </div>
            <p className="ms-auto w-fit italic text-sm text-slate-400">
                Updated at {new Date(plan.updated_at).toLocaleString()}
            </p>
        </Card>
    );
}

export function BudgetCardGridSkeleton() {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(24rem,1fr))] gap-8">
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
        </div>
    );
}

function BudgetCardSkeleton() {
    return <Skeleton className="h-96"></Skeleton>;
}
