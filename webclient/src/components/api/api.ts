import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider.tsx";

function useAPI<T>(
  method: "GET" | "PUT" | "POST" | "DELETE",
  endpoint: string,
  initialValue: T,
) {
  const [data, setData] = useState<T>(initialValue);
  const auth = useAuth();
  const url = `/api/v1${endpoint}`;

  useEffect(() => {
    fetch(url, {
      method: method,
      headers: {
        "Authorization": `Bearer ${auth.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((dat: T) => setData(dat))
      .catch((e) => setData(initialValue));
  }, [endpoint]);
}
