import { Link } from './link';

export interface Resource {
    _links: Record<string, Link>;
}
