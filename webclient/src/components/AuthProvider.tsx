import { createContext, ReactNode, useContext, useState } from "react";

type UUID = string;

interface User {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Auth {
  isAuthenticated: boolean;
  user: User;
  accessToken: string;
}

interface AuthContextProps {
  auth: Auth;
  setAuth: (auth: Auth) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<Auth>({
    isAuthenticated: false,
    user: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    accessToken: "",
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): Auth {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be using in AuthProvider");
  }
  return authContext.auth;
}

export { AuthProvider, useAuth };
