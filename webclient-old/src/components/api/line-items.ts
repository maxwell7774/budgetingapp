import { useAPICollection, useAPIMutation } from './api.ts';
import { Link, Resource } from './links.ts';

export interface LineItem extends Resource {
    id: string;
    user_id: string;
    plan_id: string;
    plan_category_id: string;
    description: string;
    deposit: number;
    withdrawal: number;
    created_at: string;
    updated_at: string;
}

export interface CreateLineItemParams extends Resource {
    plan_category_id: string;
    description: string;
    amount: number;
}

export function useLineItems(planID?: string, planCategoryID?: string) {
    return useAPICollection<LineItem>({
        href:
            `/api/v1/line-items?plan_id=${planID}&plan_category_id=${planCategoryID}`,
    });
}

export function useLineItem(id: string) {
    return useAPICollection<LineItem>({
        href: `/api/v1/line-items/${id}`,
    });
}

export function useCreateLineItem(link?: Link) {
    return useAPIMutation<LineItem>(link);
}

export function useDeleteLineItem(link?: Link) {
    return useAPIMutation<LineItem>(link);
}
