import { BaseFormState, FormState } from '@/lib/types';

export function createActionFn<T, C = void>(
    actionFn: (
        state: FormState<T>,
        formData: FormData,
        context: C
    ) => Promise<FormState<T>>
): (
    state: FormState<T>,
    formData: FormData,
    context: C
) => Promise<FormState<T>> {
    return actionFn;
}

export function createBaseActionFn<C = void>(
    actionFn: (
        state: BaseFormState,
        formData: FormData,
        context: C
    ) => Promise<BaseFormState>
): (
    state: BaseFormState,
    formData: FormData,
    context: C
) => Promise<BaseFormState> {
    return actionFn;
}
