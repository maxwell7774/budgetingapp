import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface User {
  id: string;
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

const defaultAuthValue: Auth = {
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
};

interface AuthContextProps {
  auth: Auth;
  setAuth: (auth: Auth) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<Auth>(defaultAuthValue);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/v1/auth/refresh")
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const dat = await res.json();
        throw new Error(dat.error);
      })
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
      .catch((e) => console.log(e))
      .finally(() => setIsMounted(true));
  }, []);

  if (!isMounted) return;

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
      throw new Error("Couldn't authenticate user");
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

  return login;
}

function useLogout() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useLogout must be used in AuthProvider");
  }

  const logout = async function () {
    const res = await fetch(
      "/api/v1/auth/revoke",
      {
        method: "POST",
      },
    );

    if (res.status !== 204) {
      throw new Error("Couldn't logout user");
    }

    authContext.setAuth(defaultAuthValue);
  };

  return logout;
}

export { AuthProvider, useAuth, useLogin, useLogout };
