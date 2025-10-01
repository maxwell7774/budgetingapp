'use client';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

interface Props {
    createPlan: (formData: FormData) => void;
}

export function CreatePlanForm({ createPlan }: Props) {
    return (
        <form action={createPlan}>
            <input placeholder="name" />
            <Button type="submit">Submit</Button>
            <Select name="TestSelect">
                <SelectTrigger>
                    <SelectValue placeholder="select something..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Test 1</SelectItem>
                    <SelectItem value="2">Test 2</SelectItem>
                    <SelectItem value="3">Test 3</SelectItem>
                    <SelectItem value="4">Test 4</SelectItem>
                    <SelectItem value="5">Test 5</SelectItem>
                </SelectContent>
            </Select>
        </form>
    );
}
