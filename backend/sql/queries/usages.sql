-- name: GetPlansUsageForOwner :many
WITH category_sums AS (
    SELECT
        plan_id,
        SUM(withdrawl) AS total_withdrawl,
        SUM(deposit) AS total_deposit
    FROM plan_categories
    GROUP BY plan_id
),
line_item_sums AS (
    SELECT
        plan_categories.plan_id,
        SUM(line_items.withdrawl) AS total_withdrawl,
        SUM(line_items.deposit) AS total_deposit
    FROM line_items 
    JOIN plan_categories ON plan_categories.id = line_items.plan_category_id
    GROUP BY plan_categories.plan_id
)
SELECT
    plans.id AS plan_id,
    COALESCE(category_sums.total_withdrawl, 0)::BIGINT AS target_withdrawl_amount,
    COALESCE(category_sums.total_deposit, 0)::BIGINT AS target_deposit_amount,
    COALESCE(line_item_sums.total_withdrawl, 0)::BIGINT AS actual_withdrawl_amount,
    COALESCE(line_item_sums.total_deposit, 0)::BIGINT AS actual_deposit_amount
FROM plans
LEFT JOIN category_sums ON category_sums.plan_id = plans.id
LEFT JOIN line_item_sums ON line_item_sums.plan_id = plans.id
WHERE plans.owner_id = $1
  AND plans.name ILIKE '%' || sqlc.arg(keyword) || '%'
ORDER BY plans.name
LIMIT $2 OFFSET $3;
