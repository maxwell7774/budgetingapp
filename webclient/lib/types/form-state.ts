export interface BaseFormState {
    success: boolean;
    message: string;
}

export interface FormState<T> extends BaseFormState {
    errors?: {
        [K in keyof T]?: string[];
    };
    inputs?: {
        [K in keyof T]: T[K];
    };
}
