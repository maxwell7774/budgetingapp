import { BudgetCategoriesList } from './_components/budget-categories-list';
import { BudgetInfo } from './_components/budget-info';
import { Suspense } from 'react';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function BudgetDetails({ params }: Props) {
    const { id } = await params;

    return (
        <div>
            <Suspense fallback={'Loading...'}>
                <BudgetInfo id={id} />
            </Suspense>
            <Suspense fallback={'Loading...'}>
                <BudgetCategoriesList planID={id} />
            </Suspense>
        </div>
    );
}
