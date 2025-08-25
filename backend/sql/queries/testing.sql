-- Test plan id:
-- b7ab802a-3849-4d14-ab0d-c89dc34ec17e

-- Test plan category ids:
-- 2cec855f-02ef-46ef-8086-67f0271bca46 Adam's Income
-- bece742b-0094-40fb-a51b-0ccdd4102604 Beth's Income
-- 7d265054-846c-4e37-8642-3f195a6c56f2 Groceries
-- 3bfb075a-597f-47dd-b197-c7a59bc1d840 Bills

-- WITH category_sums AS(
--     SELECT
--         plan_categories.id AS plan_category_id,
--         COALESCE(SUM(line_items.withdrawal), 0) AS actual_w,
--         COALESCE(SUM(line_items.deposit), 0) AS actual_d
--     FROM plan_categories
--     LEFT JOIN line_items ON line_items.plan_category_id = plan_categories.id
--     WHERE plan_categories.plan_id = 'b7ab802a-3849-4d14-ab0d-c89dc34ec17e'
--     GROUP BY plan_categories.id
-- )
-- SELECT
--     plan_categories.id,
--     plan_categories.name,
--     plan_categories.withdrawal AS target_w,
--     plan_categories.deposit AS target_d,
--     category_sums.actual_w,
--     category_sums.actual_d,
--     CASE
--         WHEN plan_categories.withdrawal > 0 THEN category_sums.actual_w - category_sums.actual_d
--         ELSE 0
--     END AS sum_w,
--     CASE
--         WHEN plan_categories.deposit > 0 THEN category_sums.actual_d - category_sums.actual_w
--         ELSE 0
--     END AS sum_d
-- FROM plan_categories
-- LEFT JOIN category_sums ON category_sums.plan_category_id = plan_categories.id
-- WHERE plan_categories.plan_id = 'b7ab802a-3849-4d14-ab0d-c89dc34ec17e';


-- WITH category_sums AS(
--     SELECT
--         plan_categories.id AS plan_category_id,
--         COALESCE(SUM(line_items.withdrawal), 0) AS actual_w,
--         COALESCE(SUM(line_items.deposit), 0) AS actual_d
--     FROM plan_categories
--     LEFT JOIN line_items ON line_items.plan_category_id = plan_categories.id
--     GROUP BY plan_categories.id
-- ),
-- plan_sums AS(
--     SELECT
--         plan_categories.id,
--         plan_categories.plan_id,
--         plan_categories.name,
--         plan_categories.withdrawal AS target_w,
--         plan_categories.deposit AS target_d,
--         category_sums.actual_w,
--         category_sums.actual_d,
--         CASE
--             WHEN plan_categories.withdrawal > 0 THEN category_sums.actual_w - category_sums.actual_d
--             ELSE 0
--         END AS sum_w,
--         CASE
--             WHEN plan_categories.deposit > 0 THEN category_sums.actual_d - category_sums.actual_w
--             ELSE 0
--         END AS sum_d
--     FROM plan_categories
--     LEFT JOIN category_sums ON category_sums.plan_category_id = plan_categories.id
-- )
-- SELECT
--     plans.id,
--     plans.name,
--     COALESCE(SUM(plan_sums.target_w), 0) AS target_w,
--     COALESCE(SUM(plan_sums.target_d), 0) AS target_d,
--     COALESCE(SUM(plan_sums.actual_w), 0) AS actual_w,
--     COALESCE(SUM(plan_sums.actual_d), 0) AS actual_d,
--     COALESCE(SUM(plan_sums.sum_w), 0) AS sum_w,
--     COALESCE(SUM(plan_sums.sum_d), 0) AS sum_d
-- FROM plans
-- LEFT JOIN plan_sums ON plan_sums.plan_id = plans.id
-- WHERE plans.id = 'b7ab802a-3849-4d14-ab0d-c89dc34ec17e'
-- GROUP BY plans.id, plans.name;

WITH plan_sums AS (
    SELECT
        pc.id,
        pc.plan_id,
        pc.name,
        pc.withdrawal AS target_w,
        pc.deposit AS target_d,
        COALESCE(SUM(li.withdrawal), 0) AS actual_w,
        COALESCE(SUM(li.deposit), 0) AS actual_d,
        CASE
            WHEN pc.withdrawal > 0 THEN COALESCE(SUM(li.withdrawal), 0) - COALESCE(SUM(li.deposit), 0)
            ELSE 0
        END AS sum_w,
        CASE
            WHEN pc.deposit > 0 THEN COALESCE(SUM(li.deposit), 0) - COALESCE(SUM(li.withdrawal), 0)
            ELSE 0
        END AS sum_d
    FROM plan_categories pc
    LEFT JOIN line_items li ON li.plan_category_id = pc.id
    GROUP BY pc.id, pc.plan_id, pc.name, pc.withdrawal, pc.deposit
)
SELECT
    plans.id,
    plans.name,
    COALESCE(SUM(plan_sums.target_w), 0) AS target_w,
    COALESCE(SUM(plan_sums.target_d), 0) AS target_d,
    COALESCE(SUM(plan_sums.actual_w), 0) AS actual_w,
    COALESCE(SUM(plan_sums.actual_d), 0) AS actual_d,
    COALESCE(SUM(plan_sums.sum_w), 0) AS sum_w,
    COALESCE(SUM(plan_sums.sum_d), 0) AS sum_d
FROM plans
LEFT JOIN plan_sums ON plan_sums.plan_id = plans.id
GROUP BY plans.id, plans.name;
