export type FormErrors = Record<string, string>;

export interface FormState {
    message: string;
    errors?: FormErrors;
}
