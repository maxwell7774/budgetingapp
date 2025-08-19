-- +goose Up
ALTER TABLE line_items
DROP COLUMN plan_id;


-- +goose Down
ALTER TABLE line_items
ADD COLUMN plan_id UUID REFERENCES plans(id);

UPDATE line_items
SET plan_id = plan_categories.plan_id
FROM plan_categories
WHERE line_items.plan_category_id = plan_categories.id;

ALTER TABLE line_items
ALTER COLUMN plan_id SET NOT NULL;
