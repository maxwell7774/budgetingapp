import { Resource } from "./links.ts";

export interface PlanUsage extends Resource {
  plan_id: string;
  plan_name: string;
  target_withdrawal: number;
  target_deposit: number;
  actual_withdrawal: number;
  actual_deposit: number;
  net_withdrawal: number;
  net_deposit: number;
}

export interface PlanCategoryUsage extends Resource {
  plan_id: string;
  plan_category_id: string;
  plan_category_name: string;
  target_withdrawal: number;
  target_deposit: number;
  actual_withdrawal: number;
  actual_deposit: number;
  net_withdrawal: number;
  net_deposit: number;
}
