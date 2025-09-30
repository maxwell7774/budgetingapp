export interface Link {
    href: string;
    method?: HTTPMethod;
    title?: string;
    templated?: boolean;
    name?: string;
}
export enum HTTPMethod {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}
