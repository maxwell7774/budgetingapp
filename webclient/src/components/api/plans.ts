import { useAPICollection, useAPIMutation, useAPIResource } from "./api.ts";
import { Link, Resource } from "./links.ts";

export interface Plan extends Resource {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function usePlans() {
  return useAPICollection<Plan>({
    href: "/api/v1/plans",
  });
}

export function usePlan(id: string) {
  return useAPIResource<Plan>(
    { href: `/api/v1/plans/${id}` },
  );
}

export function useCreatePlan(link?: Link) {
  return useAPIMutation<Plan>(link);
}

export function useDeletePlan(link?: Link) {
  return useAPIMutation<Plan>(link);
}
