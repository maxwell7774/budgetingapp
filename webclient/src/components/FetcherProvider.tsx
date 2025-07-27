import { createContext, ReactNode } from "react";
import { useAuth } from "./AuthProvider.tsx";

interface APIContextProps {
}

const APIContext = createContext<string>("");

interface APIProviderProps {
  children: ReactNode;
}

function APIProvider({ children }: APIProviderProps) {
  return (
    <APIContext.Provider value="">
      {children}
    </APIContext.Provider>
  );
}
