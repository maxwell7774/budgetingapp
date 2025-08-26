-- name: GetPlanCategoriesUsageForPlan :many
SELECT
    plan_categories.id AS plan_category_id,
    plan_categories.plan_id,
    plan_categories.name,
    plan_categories.withdrawal AS target_withdrawal,
    plan_categories.deposit AS target_deposit,
    COALESCE(SUM(line_items.withdrawal), 0)::BIGINT AS actual_withdrawal,
    COALESCE(SUM(line_items.deposit), 0)::BIGINT AS actual_deposit,
    CASE
        WHEN plan_categories.withdrawal > 0 THEN COALESCE(SUM(line_items.withdrawal), 0)::BIGINT - COALESCE(SUM(line_items.deposit), 0)
        ELSE 0
    END AS net_withdrawal,
    CASE
        WHEN plan_categories.deposit > 0 THEN COALESCE(SUM(line_items.deposit), 0)::BIGINT - COALESCE(SUM(line_items.withdrawal), 0)
        ELSE 0
    END AS net_deposit
FROM plan_categories
LEFT JOIN line_items ON line_items.plan_category_id = plan_categories.id
WHERE plan_categories.plan_id = $1
GROUP BY plan_categories.id, plan_categories.plan_id, plan_categories.name, plan_categories.withdrawal, plan_categories.deposit
ORDER BY plan_categories.name
LIMIT $2 OFFSET $3;

-- name: GetAllPlanUsagesForOwnerID :many
WITH plan_sums AS (
    SELECT
        plan_categories.id,
        plan_categories.plan_id,
        plan_categories.name,
        plan_categories.withdrawal AS target_withdrawal,
        plan_categories.deposit AS target_deposit,
        COALESCE(SUM(line_items.withdrawal), 0)::BIGINT AS actual_withdrawal,
        COALESCE(SUM(line_items.deposit), 0)::BIGINT AS actual_deposit,
        CASE
            WHEN plan_categories.withdrawal > 0 THEN COALESCE(SUM(line_items.withdrawal), 0)::BIGINT - COALESCE(SUM(line_items.deposit), 0)
            ELSE 0
        END AS net_withdrawal,
        CASE
            WHEN plan_categories.deposit > 0 THEN COALESCE(SUM(line_items.deposit), 0)::BIGINT - COALESCE(SUM(line_items.withdrawal), 0)
            ELSE 0
        END AS net_deposit
    FROM plan_categories
    LEFT JOIN line_items ON line_items.plan_category_id = plan_categories.id
    LEFT JOIN plans ON plans.id = plan_categories.plan_id
    WHERE plans.owner_id = $1
      AND plans.name ILIKE '%' || sqlc.arg(keyword) || '%'
    GROUP BY plan_categories.id, plan_categories.plan_id, plan_categories.name, plan_categories.withdrawal, plan_categories.deposit
)
SELECT
    plans.id AS plan_id,
    plans.name AS plan_name,
    COALESCE(SUM(plan_sums.target_withdrawal), 0)::BIGINT AS target_withdrawal,
    COALESCE(SUM(plan_sums.target_deposit), 0)::BIGINT AS target_deposit,
    COALESCE(SUM(plan_sums.actual_withdrawal), 0)::BIGINT AS actual_withdrawal,
    COALESCE(SUM(plan_sums.actual_deposit), 0)::BIGINT AS actual_deposit,
    COALESCE(SUM(plan_sums.net_withdrawal), 0)::BIGINT AS net_withdrawal,
    COALESCE(SUM(plan_sums.net_deposit), 0)::BIGINT AS net_deposit
FROM plans
LEFT JOIN plan_sums ON plan_sums.plan_id = plans.id
WHERE plans.owner_id = $1
  AND plans.name ILIKE '%' || sqlc.arg(keyword) || '%'
GROUP BY plans.id, plans.name
ORDER BY plans.created_at
LIMIT $2 OFFSET $3;

-- name: GetPlanUsageByID :one
WITH plan_sums AS (
    SELECT
        plan_categories.id,
        plan_categories.plan_id,
        plan_categories.name,
        plan_categories.withdrawal AS target_withdrawal,
        plan_categories.deposit AS target_deposit,
        COALESCE(SUM(line_items.withdrawal), 0)::BIGINT AS actual_withdrawal,
        COALESCE(SUM(line_items.deposit), 0)::BIGINT AS actual_deposit,
        CASE
            WHEN plan_categories.withdrawal > 0 THEN COALESCE(SUM(line_items.withdrawal), 0)::BIGINT - COALESCE(SUM(line_items.deposit), 0)
            ELSE 0
        END AS net_withdrawal,
        CASE
            WHEN plan_categories.deposit > 0 THEN COALESCE(SUM(line_items.deposit), 0)::BIGINT - COALESCE(SUM(line_items.withdrawal), 0)
            ELSE 0
        END AS net_deposit
    FROM plan_categories
    LEFT JOIN line_items ON line_items.plan_category_id = plan_categories.id
    LEFT JOIN plans ON plans.id = plan_categories.plan_id
    WHERE plan_categories.plan_id = $1
    GROUP BY plan_categories.id, plan_categories.plan_id, plan_categories.name, plan_categories.withdrawal, plan_categories.deposit
)
SELECT
    plans.id AS plan_id,
    plans.name AS plan_name,
    COALESCE(SUM(plan_sums.target_withdrawal), 0)::BIGINT AS target_withdrawal,
    COALESCE(SUM(plan_sums.target_deposit), 0)::BIGINT AS target_deposit,
    COALESCE(SUM(plan_sums.actual_withdrawal), 0)::BIGINT AS actual_withdrawal,
    COALESCE(SUM(plan_sums.actual_deposit), 0)::BIGINT AS actual_deposit,
    COALESCE(SUM(plan_sums.net_withdrawal), 0)::BIGINT AS net_withdrawal,
    COALESCE(SUM(plan_sums.net_deposit), 0)::BIGINT AS net_deposit
FROM plans
LEFT JOIN plan_sums ON plan_sums.plan_id = plans.id
WHERE plans.id = $1
GROUP BY plans.id, plans.name;
