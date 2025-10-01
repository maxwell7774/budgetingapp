import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api, createPlan } from '@/lib/api';
import { Collection, Plan } from '@/lib/types';
import { CreatePlanForm } from './_components/create-plan-form';

export default async function BudgetsPage() {
    const res = await api.fetch('/api/v1/plans');
    const plans: Collection<Plan> = await res.json();

    return (
        <div>
            <p>budgets</p>
            <Card className="my-8">
                {/* <form action={createPlan}> */}
                {/*     <Input name="name" placeholder="name" /> */}
                {/*     <select name="nothing"> */}
                {/*         <option>Test 1</option> */}
                {/*         <option>Test 2</option> */}
                {/*         <option>Test 3</option> */}
                {/*         <option>Test 4</option> */}
                {/*     </select> */}
                {/*     <Input name="date" type="date" /> */}
                {/*     <Button type="submit">Submit</Button> */}
                {/* </form> */}
            </Card>
            <Card className="mb-8">
                <CreatePlanForm createPlan={createPlan} />
            </Card>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(24rem,1fr))] gap-8">
                {plans._embedded.items.map((p) => (
                    <Card key={p.id}>
                        <h2>{p.name}</h2>
                        <p>{p.owner_id}</p>
                        <p className="mb-8">{p.created_at}</p>
                        {Object.keys(p._links).map((l, index) => (
                            <p key={p._links[l].href + index} className="mb-8">
                                <span className="text-indigo-500">
                                    {l + ': '}
                                </span>
                                {`${JSON.stringify(p._links[l])}`}
                            </p>
                        ))}
                    </Card>
                ))}
            </div>
        </div>
    );
}
