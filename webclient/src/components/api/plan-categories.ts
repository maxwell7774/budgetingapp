import { useAPICollection, useAPIMutation, useAPIResource } from "./api.ts";
import { Link, Resource } from "./links.ts";

export interface PlanCategory extends Resource {
  id: string;
  plan_id: string;
  name: string;
  deposit: number;
  withdrawal: number;
  created_at: string;
  updated_at: string;
}

export function usePlanCategories(planID: string) {
  return useAPICollection<PlanCategory>({
    href: `/api/v1/plan-categories?plan_id=${planID}`,
  });
}

export function usePlanCategory(id: string) {
  return useAPIResource<PlanCategory>({
    href: `/api/v1/plan-categories/${id}`,
  });
}

export function useCreatePlanCategory(link?: Link) {
  return useAPIMutation<PlanCategory>(link);
}

export function useDeletePlanCategory(link?: Link) {
  return useAPIMutation<PlanCategory>(link);
}
