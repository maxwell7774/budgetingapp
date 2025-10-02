import { Card } from '@/components/ui/card';
import { CreatePlanForm } from './_components/create-plan-form';
import { Suspense } from 'react';
import { createPlan } from '@/lib/api';
import {
    BudgetCardGrid,
    BudgetCardGridSkeleton,
} from './_components/budget-card-grid';

export default async function BudgetsPage() {
    return (
        <div>
            <p>budgets</p>
            <Card className="my-8 max-w-lg mx-auto">
                <h2 className="text-lg text-bold text-indigo-500 mb-8">
                    Create New Plan
                </h2>
                <CreatePlanForm createPlan={createPlan} />
            </Card>
            <Suspense fallback={<BudgetCardGridSkeleton />}>
                <BudgetCardGrid />
            </Suspense>
        </div>
    );
}
