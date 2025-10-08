import {
    CreatePlanCategoryParams,
    HTTPMethod,
    PlanCategory,
} from '@/lib/types';
import { apiRequest, CallbackFn } from './api';

export function createPlanCategory(
    params: CreatePlanCategoryParams,
    callbacks?: CallbackFn<PlanCategory>
) {
    return apiRequest({
        url: `/api/v1/plan-categories`,
        method: HTTPMethod.PUT,
        params: params,
        callbacks: callbacks,
    });
}
