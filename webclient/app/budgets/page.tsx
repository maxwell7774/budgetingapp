import { Suspense } from 'react';
import {
    BudgetCardGrid,
    BudgetCardGridSkeleton,
} from './_components/budget-card-grid';
import { CreateBudgetDialog } from './_components/create-plan-dialog';
import { Separator } from '@/components/ui/separator';

export default async function BudgetsPage() {
    return (
        <div>
            <div className="flex items-end justify-between pb-2">
                <h1 className="text-lg font-bold text-slate-500 h-full">
                    Budgets
                </h1>
                <CreateBudgetDialog />
            </div>
            <Separator className="mb-8" />
            <Suspense fallback={<BudgetCardGridSkeleton />}>
                <BudgetCardGrid />
            </Suspense>
        </div>
    );
}
