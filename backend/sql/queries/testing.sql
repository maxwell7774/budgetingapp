--Gets all plan categories usages
SELECT
    plan_categories.id,
    plan_categories.plan_id,
    plan_categories.name,
    plan_categories.withdrawal AS target_withdrawal,
    plan_categories.deposit AS target_deposit,
    COALESCE(SUM(line_items.withdrawal), 0) AS actual_withdrawal,
    COALESCE(SUM(line_items.deposit), 0) AS actual_deposit,
    CASE
        WHEN plan_categories.withdrawal > 0 THEN COALESCE(SUM(line_items.withdrawal), 0) - COALESCE(SUM(line_items.deposit), 0)
        ELSE 0
    END AS net_withdrawal,
    CASE
        WHEN plan_categories.deposit > 0 THEN COALESCE(SUM(line_items.deposit), 0) - COALESCE(SUM(line_items.withdrawal), 0)
        ELSE 0
    END AS net_deposit
FROM plan_categories
LEFT JOIN line_items ON line_items.plan_category_id = plan_categories.id
WHERE plan_categories.plan_id = '2569061a-ecb8-4645-b031-095fb68cc1c1'
GROUP BY plan_categories.id, plan_categories.plan_id, plan_categories.name, plan_categories.withdrawal, plan_categories.deposit;

-- Gets all plans usages
WITH plan_sums AS (
    SELECT
        plan_categories.id,
        plan_categories.plan_id,
        plan_categories.name,
        plan_categories.withdrawal AS target_withdrawal,
        plan_categories.deposit AS target_deposit,
        COALESCE(SUM(line_items.withdrawal), 0) AS actual_withdrawal,
        COALESCE(SUM(line_items.deposit), 0) AS actual_deposit,
        CASE
            WHEN plan_categories.withdrawal > 0 THEN COALESCE(SUM(line_items.withdrawal), 0) - COALESCE(SUM(line_items.deposit), 0)
            ELSE 0
        END AS net_withdrawal,
        CASE
            WHEN plan_categories.deposit > 0 THEN COALESCE(SUM(line_items.deposit), 0) - COALESCE(SUM(line_items.withdrawal), 0)
            ELSE 0
        END AS net_deposit
    FROM plan_categories
    LEFT JOIN line_items ON line_items.plan_category_id = plan_categories.id
    LEFT JOIN plans ON plans.id = plan_categories.plan_id
    WHERE plans.owner_id = '75b35264-b123-4f22-ad76-2f2169bc02a5'
    GROUP BY plan_categories.id, plan_categories.plan_id, plan_categories.name, plan_categories.withdrawal, plan_categories.deposit
)
SELECT
    plans.id,
    plans.name,
    COALESCE(SUM(plan_sums.target_withdrawal), 0) AS target_withdrawal,
    COALESCE(SUM(plan_sums.target_deposit), 0) AS target_deposit,
    COALESCE(SUM(plan_sums.actual_withdrawal), 0) AS actual_withdrawal,
    COALESCE(SUM(plan_sums.actual_deposit), 0) AS actual_deposit,
    COALESCE(SUM(plan_sums.net_withdrawal), 0) AS net_withdrawal,
    COALESCE(SUM(plan_sums.net_deposit), 0) AS net_deposit
FROM plans
LEFT JOIN plan_sums ON plan_sums.plan_id = plans.id
WHERE plans.owner_id = '75b35264-b123-4f22-ad76-2f2169bc02a5'
GROUP BY plans.id, plans.name;

-- Gets one plan's usages
WITH plan_sums AS (
    SELECT
        plan_categories.id,
        plan_categories.plan_id,
        plan_categories.name,
        plan_categories.withdrawal AS target_withdrawal,
        plan_categories.deposit AS target_deposit,
        COALESCE(SUM(line_items.withdrawal), 0) AS actual_withdrawal,
        COALESCE(SUM(line_items.deposit), 0) AS actual_deposit,
        CASE
            WHEN plan_categories.withdrawal > 0 THEN COALESCE(SUM(line_items.withdrawal), 0) - COALESCE(SUM(line_items.deposit), 0)
            ELSE 0
        END AS net_withdrawal,
        CASE
            WHEN plan_categories.deposit > 0 THEN COALESCE(SUM(line_items.deposit), 0) - COALESCE(SUM(line_items.withdrawal), 0)
            ELSE 0
        END AS net_deposit
    FROM plan_categories
    LEFT JOIN line_items ON line_items.plan_category_id = plan_categories.id
    WHERE plan_categories.plan_id = '2569061a-ecb8-4645-b031-095fb68cc1c1'
    GROUP BY plan_categories.id, plan_categories.plan_id, plan_categories.name, plan_categories.withdrawal, plan_categories.deposit
)
SELECT
    plans.id,
    plans.name,
    COALESCE(SUM(plan_sums.target_withdrawal), 0) AS target_withdrawal,
    COALESCE(SUM(plan_sums.target_deposit), 0) AS target_deposit,
    COALESCE(SUM(plan_sums.actual_withdrawal), 0) AS actual_withdrawal,
    COALESCE(SUM(plan_sums.actual_deposit), 0) AS actual_deposit,
    COALESCE(SUM(plan_sums.net_withdrawal), 0) AS net_withdrawal,
    COALESCE(SUM(plan_sums.net_deposit), 0) AS net_deposit
FROM plans
LEFT JOIN plan_sums ON plan_sums.plan_id = plans.id
WHERE plans.id = '2569061a-ecb8-4645-b031-095fb68cc1c1'
GROUP BY plans.id, plans.name;
