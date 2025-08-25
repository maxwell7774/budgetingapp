-- +goose Up
CREATE TABLE line_items(
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    plan_id UUID NOT NULL REFERENCES plans(id),
    plan_category_id UUID NOT NULL REFERENCES plan_categories(id),
    description TEXT NOT NULL,
    deposit INT NOT NULL,
    withdrawal INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE line_items;
