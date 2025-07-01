-- +goose Up
CREATE TABLE plan_categories(
    id UUID PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES plans(id),
    name TEXT UNIQUE NOT NULL,
    deposit INT NOT NULL,
    withdrawl INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE plan_categories;
