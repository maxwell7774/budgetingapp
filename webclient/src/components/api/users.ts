import { User } from "../AuthProvider.tsx";
import { ErrorResponse } from "./error.ts";

interface CreateUserParams {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

function useUsers() {
  const createUser = async function (params: CreateUserParams): Promise<User> {
    const url = "/api/v1/users";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const dat: ErrorResponse = await res.json();
      throw new Error(dat.error);
    }
    const dat: User = await res.json();

    return dat;
  };

  return { createUser };
}

export default useUsers;
