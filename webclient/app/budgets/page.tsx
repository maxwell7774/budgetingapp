import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth/server';
import { headers } from 'next/headers';

export default async function BudgetsPage() {
    const { token } = await auth.api.getToken({ headers: await headers() });
    const res = await fetch(process.env.GO_API_URL + '/api/v1/plans', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log(await res.json());

    return (
        <div>
            <p>budgets</p>
            <Button>Test API Health</Button>
        </div>
    );
}
