/*
type Link struct {
	Href      string `json:"href"`
	Method    string `json:"method,omitempty"`
	Title     string `json:"title,omitempty"`
	Templated bool   `json:"templated,omitempty"`
	Name      string `json:"name,omitempty"`
}
*/

import { Auth } from '../auth-provider.tsx';

type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';
export interface Link {
    href: string;
    method?: HTTPMethod;
    title?: string;
    templated?: boolean;
    name?: string;
}

function resource(url: string, auth: Auth) {
    const fetchResource = async function () {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    };
    return {};
}

function link(name: string) {
    return {
        name: name,
        fetch: async function () {},
    };
}

export interface Resource {
    _links: Record<string, Link>;
}

export interface Collection<T extends Resource> {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
    _links: Record<string, Link>;
    _embedded: { items: T[] };
}
