-- name: GetUsers :many
SELECT
    id,
    name,
    email,
    created_at,
    updated_at
FROM users;

-- name: GetUser :one
SELECT *
FROM users
WHERE email = $1;

-- name: CreateUser :one
INSERT INTO users(
    id,
    name,
    email,
    created_at,
    updated_at
)
VALUES (
    $1,
    $2,
    $3,
    NOW(),
    NOW()
)
RETURNING *;
