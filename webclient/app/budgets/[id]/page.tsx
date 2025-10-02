import { api } from '@/lib/api';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function BudgetDetails({ params }: Props) {
    const { id } = await params;
    const res = await api.fetch(`/api/v1/plans/${id}`);
    const budget = await res.json();

    return (
        <div>
            {budget.name}
            {Object.keys(budget._links).map((l, index) => (
                <p key={budget._links[l].href + index} className="mb-8">
                    <span className="text-indigo-500">{l + ': '}</span>
                    {`${JSON.stringify(budget._links[l])}`}
                </p>
            ))}
        </div>
    );
}
