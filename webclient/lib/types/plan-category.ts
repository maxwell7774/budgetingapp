import { Resource } from './resource';

export interface PlanCategory extends Resource {
    id: string;
    plan_id: string;
    name: string;
    deposit: number;
    withdrawal: number;
    created_at: string;
    updated_at: string;
}
