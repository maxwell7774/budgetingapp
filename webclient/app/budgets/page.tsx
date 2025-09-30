import { Button } from '@/components/ui/button';
import { createPlan } from '@/lib/api/plans';
import { auth } from '@/lib/auth/server';
import { Collection, Plan } from '@/lib/types';
import { headers } from 'next/headers';

export default async function BudgetsPage() {
    const { token } = await auth.api.getToken({ headers: await headers() });
    const res = await fetch(process.env.GO_API_URL + '/api/v1/plans', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const plans: Collection<Plan> = await res.json();
    console.log(plans);

    return (
        <div>
            <p>budgets</p>
            <form action={createPlan}>
                <input name="name" placeholder="name" />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}
