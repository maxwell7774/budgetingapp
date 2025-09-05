import { createContext, ReactNode } from 'react';

const APIClientContext = createContext<string>('');

interface APIClientProviderProps {
    children: ReactNode;
}

function APIClientProvider({ children }: APIClientProviderProps) {
    return (
        <APIClientContext.Provider value=''>
            {children}
        </APIClientContext.Provider>
    );
}

export { APIClientProvider };
