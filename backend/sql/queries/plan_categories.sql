-- name: GetPlanCategories :many
SELECT *
FROM plan_categories
WHERE plan_id = $1;

-- name: GetPlanCategoryByID :one
SELECT *
FROM plan_categories
WHERE id = $1;

-- name: CreatePlanCategory :one
INSERT INTO plan_categories(
    id,
    plan_id,
    name,
    deposit,
    withdrawl,
    created_at,
    updated_at
)
VALUES(
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4,
    NOW(),
    NOW()
)
RETURNING *;
