import { useEffect, useState } from "react";
import { useAuth } from "../auth-provider.tsx";

export interface PlanCategory {
  id: string;
  plan_id: string;
  name: string;
  deposit: number;
  withdrawl: number;
  created_at: string;
  updated_at: string;
}

function usePlanCategories(planID: string) {
  const [planCategories, setPlanCategories] = useState<PlanCategory[]>([]);
  const auth = useAuth();

  const url = `/api/v1/plans/${planID}/categories`;

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${auth.accessToken}`,
      },
    }).then((res) => res.json())
      .then((dat: PlanCategory[]) => setPlanCategories(dat));
  }, []);

  return planCategories;
}

export { usePlanCategories };
