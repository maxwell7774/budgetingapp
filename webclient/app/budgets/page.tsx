'use client';

import { Button } from '@/components/ui/button';

export default function BudgetsPage() {
    return (
        <div>
            <p>budgets</p>
            <Button
                onClick={async () => {
                    await fetch('/api/v1/health');
                }}
            >
                Test API Health
            </Button>
        </div>
    );
}
