interface FormState {
    valid: boolean;
    touched: false;
    submitted: false;
    submitting: false;
}

type FormValidator<T> = (value: T) => string | null;

interface FormField<T> {
    name: string;
    defaultValue: T;
    value?: T;
    onChange?: (value: T) => void;
    errors: string[];
    validators: FormValidator<T>[];
}

type FormFields<T> = {
    [K in keyof T]: FormField<T[K]>;
};

interface Form<T> {
    fields: FormFields<T>;
    setFields: (fields: FormFields<T>) => void;
    state: FormState;
}

type FormValidators<T> = {
    [K in keyof T]?: FormValidator<T[K]>[];
};

interface FormProps<T> {
    defaultValues?: { [K in keyof T]?: T[K] };
    validators?: FormValidators<T>;
}

// export function useForm<T>(
//   props?: FormProps<T>,
// ): Form<T> {
//   const [fields, setFields] = useState<FormFields<T>>({} as FormFields<T>);
//
//   const { defaultValues, validators } = { ...props };
//
//   useEffect(() => {
//     if (!defaultValues) return;
//
//     const newFields: FormFields<T> = fields;
//
//     Object.keys(defaultValues).forEach((key) => {
//       const fieldKey = key as keyof T;
//       if (!newFields[fieldKey]) return;
//       newFields[fieldKey] = {
//         name: key,
//         defaultValue: defaultValues[fieldKey],
//         validators: validators && validators[fieldKey]
//           ? validators[fieldKey]
//           : [],
//         errors: [],
//       };
//     });
//   }, [defaultValues, validators]);
//
//   return {
//     fields: fields,
//     setFields: setFields,
//     state: {
//       submitted: false,
//       submitting: false,
//       touched: false,
//       valid: false,
//     },
//   };
// }
