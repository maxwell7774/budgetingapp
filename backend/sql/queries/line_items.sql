-- name: GetLineItemsForPlan :many
SELECT line_items.*
FROM line_items
JOIN plan_categories ON plan_categories.id = line_items.plan_category_id
WHERE plan_categories.plan_id = $1
LIMIT $2 OFFSET $3;

-- name: CountLineItemsForPlan :one
SELECT COUNT(*)
FROM line_items
JOIN plan_categories ON plan_categories.id = line_items.plan_category_id
WHERE plan_categories.plan_id = $1;

-- name: GetLineItemsForCategory :many
SELECT *
FROM line_items
WHERE plan_category_id = $1
LIMIT $2 OFFSET $3;

-- name: CountLineItemsForCategory :one
SELECT COUNT(*)
FROM line_items
WHERE plan_category_id = $1;

-- name: GetLineItemByID :one
SELECT *
FROM line_items
WHERE id = $1;

-- name: CreateLineItem :one
INSERT INTO line_items(
    id,
    user_id,
    plan_category_id,
    description,
    deposit,
    withdrawal,
    created_at,
    updated_at
)
VALUES(
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4,
    $5,
    NOW(),
    NOW()
)
RETURNING *;

-- name: UpdateLineItem :one
UPDATE line_items
SET
    description = $1,
    updated_at = NOW()
WHERE id = $2
RETURNING *;

-- name: DeleteLineItem :exec
DELETE FROM line_items
WHERE id = $1;
