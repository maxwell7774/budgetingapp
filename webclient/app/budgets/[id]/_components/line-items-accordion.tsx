import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/server';
import { Collection, LineItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

interface Props {
    categoryID: string;
}

export async function LineItemsAccordion({ categoryID }: Props) {
    const lineItems: Collection<LineItem> = await api
        .fetch(`/api/v1/line-items`)
        .then((res) => res.json());
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="line-items" className="group">
                <AccordionTrigger asChild>
                    <div className="w-max ms-auto">
                        <Button variant={'ghost'}>
                            Line Items
                            <ChevronDownIcon className="size-5 ms-2 group-data-[state=open]:rotate-180 transition-transform" />
                        </Button>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">
                                <th className="w-full p-4">DESCRIPTION</th>
                                <th className="p-4">DEPOSIT</th>
                                <th className="p-4">WITHDRAWAL</th>
                                <th className="p-4">DATE</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItems._embedded.items?.map((l: LineItem) => (
                                <LineItemRow key={l.id} lineItem={l} />
                            ))}
                        </tbody>
                    </table>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

interface LineItemProps {
    lineItem: LineItem;
}

function LineItemRow({ lineItem }: LineItemProps) {
    return (
        <tr>
            <td className="w-full p-4">{lineItem.description}</td>
            <td className={`p-4 ${lineItem.deposit > 0 && 'text-lime-600'}`}>
                {formatCurrency(lineItem.deposit)}
            </td>
            <td className={`p-4 ${lineItem.withdrawal > 0 && 'text-red-600'}`}>
                {formatCurrency(lineItem.withdrawal)}
            </td>
            <td className="p-4 text-nowrap">
                {new Date(lineItem.created_at).toLocaleDateString()}
            </td>
            <td>
                <Button variant="outline">Revert</Button>
            </td>
        </tr>
    );
}
