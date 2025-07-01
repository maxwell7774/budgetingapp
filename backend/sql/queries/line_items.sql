-- name: GetLineItems :many
SELECT *
FROM line_items
WHERE plan_id = $1;

-- name: CreateLineItem :one
INSERT INTO line_items(
    id,
    plan_id,
    plan_category_id,
    description,
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
    $5,
    NOW(),
    NOW()
)
RETURNING *;
