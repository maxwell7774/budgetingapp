-- name: GetUsers :many
SELECT
    id,
    first_name,
    last_name,
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
    first_name,
    last_name,
    email,
    created_at,
    updated_at
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    NOW(),
    NOW()
)
RETURNING *;
