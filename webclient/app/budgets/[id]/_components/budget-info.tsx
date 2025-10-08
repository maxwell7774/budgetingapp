import { api } from '@/lib/api/server';
import { Plan, PlanUsage } from '@/lib/types';

async function fetchPlan(id: string): Promise<Plan> {
    const res = await api.fetch(`/api/v1/plans/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch plan: ${res.status}`);
    }
    const plan: Plan = await res.json();
    return plan;
}

async function fetchPlanUsage(planID: string): Promise<PlanUsage> {
    const res = await api.fetch(`/api/v1/plans/${planID}/usage`);
    if (!res.ok) {
        throw new Error(`Failed to fetch plan usage: ${res.status}`);
    }
    const planUsage: PlanUsage = await res.json();
    return planUsage;
}

interface Props {
    id: string;
}

export async function BudgetInfo({ id }: Props) {
    const [budget, budgetUsage] = await Promise.all([
        fetchPlan(id),
        fetchPlanUsage(id),
    ]);

    return (
        <div>
            <h1 className="text-lg font-bold text-slate-500 h-full">
                {budget.name}
            </h1>
            <p>{JSON.stringify(budgetUsage)}</p>
        </div>
    );
}
