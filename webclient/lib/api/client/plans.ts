import { CreatePlanParams, HTTPMethod, Plan } from '@/lib/types';
import { apiRequest, CallbackFn } from './api';

export function createPlan(
    params: CreatePlanParams,
    callbacks?: CallbackFn<Plan>
) {
    return apiRequest({
        url: '/api/v1/plans',
        method: HTTPMethod.POST,
        params: params,
        callbacks: callbacks,
    });
}

export function deletePlan(id: string, callbacks?: CallbackFn) {
    return apiRequest({
        url: `/api/v1/plans/${id}`,
        method: HTTPMethod.DELETE,
        callbacks: callbacks,
    });
}
