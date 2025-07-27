import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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

  useEffect(() => {
    fetch("/api/v1/auth/refresh")
      .then((res) => res.json())
      .then((dat) => {
        setAuth({
          isAuthenticated: true,
          user: {
            id: dat.id,
            firstName: dat.first_name,
            lastName: dat.last_name,
            email: dat.email,
            createdAt: new Date(dat.created_at),
            updatedAt: new Date(dat.updated_at),
          },
          accessToken: dat.token,
        });
      })
      .catch((e) => console.log(e));
  }, []);

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

interface LoginResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  token: string;
}

function useLogin() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useLogin must be used in AuthProvider");
  }

  const login = async function (email: string, password: string) {
    const res = await fetch(
      "/api/v1/auth/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      },
    );

    if (res.status !== 200) {
      throw new Error("Couldn't not authenticate user");
    }

    const body: LoginResponse = await res.json();

    authContext.setAuth({
      isAuthenticated: true,
      user: {
        id: body.id,
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        createdAt: new Date(body.created_at),
        updatedAt: new Date(body.updated_at),
      },
      accessToken: body.token,
    });
  };

  return { login };
}

export { AuthProvider, useAuth, useLogin };
