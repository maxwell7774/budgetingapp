-- name: GetPlanCategories :many
SELECT *
FROM plan_categories
WHERE plan_id = $1
LIMIT $2 OFFSET $3;


-- name: CountPlanCategoriesForPlan :one
SELECT COUNT(*)
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

-- name: UpdatePlanCategoryName :one
UPDATE plan_categories
SET
    name = $1,
    updated_at = NOW()
WHERE id = $2
RETURNING *;

-- name: DeletePlanCategory :exec
DELETE FROM plan_categories
WHERE id = $1;
