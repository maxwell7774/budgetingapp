import { useState } from 'react';
import { useAuth } from '../auth-provider.tsx';

enum HTTPMethod {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export interface Link {
    href: string;
    method?: HTTPMethod;
    title?: string;
    templated?: boolean;
    name?: string;
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

export interface HALResource {
    _links: Record<string, Link>;
}

export interface HALCollection<T extends HALResource> extends HALResource {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
    _embedded: { items: T[] };
}

export interface HALClientResource {
    fetching: boolean;
    failed: boolean;
    fetched_time: number;
    expires_in_secs: number;
    resource: HALResource;
}

interface HALGoParams {
    key: string;
    link: Link;
    cache_secs: number;
    ignore_cache: boolean;
    template_options?: Record<string, string>;
}

interface HALMutateParams<T> {
    link: Link;
    dat: T;
    template_options?: Record<string, string>;
}

export interface HALClient {
    resources: Record<string, HALClientResource>;
    getResource<T extends HALResource | undefined>(key: string): T;
    go<T extends HALResource>(params: HALGoParams): Promise<T>;
    mutate<
        MutateParams,
        MutateResponse extends HALResource | void = void,
    >(params: HALMutateParams<MutateParams>): Promise<MutateResponse>;
    refresh(keys: string[]): void;
}

export function useHALClient(): HALClient {
    const [resources, setResources] = useState<
        Record<string, HALClientResource>
    >({});
    const auth = useAuth();

    const getResource = function <T extends HALResource | undefined>(
        key: string,
    ): T {
        const resource = resources[key];
        if (!resource) {
            return undefined as T;
        }

        return resource.resource as T;
    };

    const go = async function <T extends HALResource>(
        {
            key,
            link,
            cache_secs = 0,
            ignore_cache = false,
            template_options,
        }: HALGoParams,
    ): Promise<T> {
        if (link.method !== HTTPMethod.GET && link.method) {
            throw new Error('HALClient go can only be used for GET links');
        }

        const cachedResource = resources[key];

        if (cachedResource && !ignore_cache) {
            const msSinceFetched = Date.now() -
                cachedResource.fetched_time;
            if (msSinceFetched < cachedResource.expires_in_secs * 1000) {
                console.log('Cached resource returned');
                return cachedResource.resource as T;
            }
        }

        const res = await fetch(link.href, {
            method: link.method,
            headers: {
                'Authorization': `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const resource: T = await res.json();

        setResources((prev) => ({
            ...prev,
            [key]: {
                fetching: false,
                fetched_time: Date.now(),
                failed: false,
                expires_in_secs: cache_secs,
                resource: resource,
            },
        }));

        return resource;
    };

    const mutate = async function <
        MutateParams,
        MutateResponse extends HALResource | void = void,
    >(
        {
            link,
            dat,
            template_options,
        }: HALMutateParams<MutateParams>,
    ): Promise<MutateResponse> {
        if (link.method === HTTPMethod.GET || !link.method) {
            throw new Error("HALCLient mutate can't be used on GET links");
        }

        if (link.method === HTTPMethod.DELETE) {
            await fetch(link.href, {
                method: link.method,
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`,
                },
            });
            return undefined as MutateResponse;
        }

        const res = await fetch(link.href, {
            method: link.method,
            headers: {
                'Authorization': `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dat),
        });

        return res.json();
    };

    const refresh = async function (keys: string[]) {
        for (const index in keys) {
            console.log('Refreshing', keys[index]);
            const resource = resources[keys[index]];
            if (!resource) continue;

            await go(
                keys[index],
                resource.resource._links['self'],
                resource.expires_in_secs,
                true,
            );
        }
    };

    return {
        resources: resources,
        getResource: getResource,
        go: go,
        refresh: refresh,
        mutate: mutate,
    };
}
