import { Resource } from './resource';

export interface Collection<T extends Resource> {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
    _embedded: { items: T[] };
}
