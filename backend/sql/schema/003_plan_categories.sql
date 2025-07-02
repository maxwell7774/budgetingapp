-- +goose Up
CREATE TABLE plan_categories(
    id UUID PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES plans(id),
    name TEXT NOT NULL,
    deposit INT NOT NULL,
    withdrawl INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE(plan_id, name)
);

-- +goose Down
DROP TABLE plan_categories;
