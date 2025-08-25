-- name: ResetLineItems :exec
DELETE FROM line_items;

-- name: ResetPlanCategories :exec
DELETE FROM plan_categories;

-- name: ResetPlans :exec
DELETE FROM plans;

-- name: ResetRefreshTokens :exec
DELETE FROM refresh_tokens;

-- name: ResetUsers :exec
DELETE FROM users;
