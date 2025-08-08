import { useEffect, useState } from "react";
import { useAuth } from "../auth-provider.tsx";
import { useAPICollection, useAPIMutation } from "./api.ts";
import { Link, Resource } from "./links.ts";

export interface Plan extends Resource {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/*
function useCreatePlan() {
  const auth = useAuth();

  const createPlan = async function (params: CreatePlanParams): Promise<Plan> {
    const url = "/api/v1/plans";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Authorization": `Bearer ${auth.accessToken}`,
      },
    });

    if (!res.ok) {
      const dat: ErrorResponse = await res.json();
      throw new Error(dat.error);
    }
    const dat: Plan = await res.json();
    return dat;
  };

  return createPlan;
}
*/

function useCreatePlan(link?: Link) {
  return useAPIMutation<Plan>(link);
}

function useDeletePlan(link?: Link) {
  return useAPIMutation<Plan>(link);
}

/*
function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const auth = useAuth();

  const url = "/api/v1/plans";

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${auth.accessToken}`,
      },
    }).then((res) => res.json())
      .then((dat: Collection) => {
        printLinks(dat);
        setPlans(dat._embedded.items as Plan[]);
      });
  }, []);

  return plans;
}
*/

function usePlans() {
  return useAPICollection<Plan>({
    href: "/api/v1/plans",
  });
}

function usePlan(id: string) {
  const [plan, setPlan] = useState<Plan | undefined>(undefined);
  const auth = useAuth();

  const url = `/api/v1/plans/${id}`;

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${auth.accessToken}`,
      },
    }).then((res) => res.json())
      .then((dat: Plan) => setPlan(dat))
      .catch(() => setPlan(undefined));
  }, []);

  return plan;
}

export { useCreatePlan, useDeletePlan, usePlan, usePlans };
