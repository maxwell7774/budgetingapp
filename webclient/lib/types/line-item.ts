import { Resource } from './resource';

export interface LineItem extends Resource {
    id: string;
    user_id: string;
    plan_category_id: string;
    description: string;
    deposit: number;
    withdrawal: number;
    created_at: string;
    updated_at: string;
}
