import { Resource } from './resource';

export interface Plan extends Resource {
    id: string;
    owner_id: string;
    name: string;
    created_at: string;
    updated_at: string;
}
