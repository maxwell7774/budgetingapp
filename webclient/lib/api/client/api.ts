import { ErrorResponse, HTTPMethod } from '@/lib/types';

export interface CallbackFn<T = void> {
    onSuccess?: (data: T) => void;
    onError?: (err: ErrorResponse) => void;
    onSettled?: () => void;
}

export interface APIRequest<T, R> {
    url: string;
    method: HTTPMethod;
    params?: T;
    callbacks?: CallbackFn<R>;
}

export async function apiRequest<T, R>({
    url,
    method = HTTPMethod.GET,
    params,
    callbacks = {},
}: APIRequest<T, R>) {
    const { onSuccess, onError, onSettled } = callbacks;
    try {
        const hasBody =
            params &&
            (method === HTTPMethod.POST ||
                method === HTTPMethod.PATCH ||
                method === HTTPMethod.PUT);

        const res = await fetch(url, {
            method: method,
            body: hasBody ? JSON.stringify(params) : undefined,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            let err: ErrorResponse;
            try {
                err = await res.json();
            } catch {
                err = { error: res.statusText };
            }
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        if (res.status === 204 || method === HTTPMethod.DELETE) {
            onSuccess?.(undefined as R);
            return;
        }

        // Parse JSON response
        const data: R = await res.json();
        onSuccess?.(data);
        return data;
    } catch (err) {
        const error: ErrorResponse = {
            error: err instanceof Error ? err.message : 'Unknown error',
        };
        onError?.(error);
        throw err;
    } finally {
        onSettled?.();
    }
}
