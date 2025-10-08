import { BaseFormState, FormState } from '@/lib/types';

export function createActionFn<T>(
    actionFn: (state: FormState<T>, formData: FormData) => Promise<FormState<T>>
): (state: FormState<T>, formData: FormData) => Promise<FormState<T>> {
    return actionFn;
}

export function createBaseActionFn(
    actionFn: (
        state: BaseFormState,
        formData: FormData
    ) => Promise<BaseFormState>
): (state: BaseFormState, formData: FormData) => Promise<BaseFormState> {
    return actionFn;
}
