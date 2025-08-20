-- name: GetPlansForOwner :many
SELECT *
FROM plans
WHERE owner_id = $1
AND name ILIKE '%' || sqlc.arg(keyword) || '%'
LIMIT $2 OFFSET $3;

-- name: CountPlansForOwner :one
SELECT COUNT(*)
FROM plans
WHERE owner_id = $1
AND name ILIKE '%' || sqlc.arg(keyword) || '%';


-- name: GetPlanByID :one
SELECT *
FROM plans
WHERE id = $1;

-- name: CreatePlan :one
INSERT INTO plans(
    id,
    owner_id,
    name,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    NOW(),
    NOW()
)
RETURNING *;

-- name: UpdatePlanName :one
UPDATE plans
SET
    name = $1,
    updated_at = NOW()
WHERE id = $2
RETURNING *;

-- name: DeletePlan :exec
DELETE FROM plans
WHERE id = $1;
