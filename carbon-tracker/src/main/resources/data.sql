INSERT IGNORE INTO emission_factors (category, activity_type, unit, factor_value) VALUES
('TRANSPORT', 'Car', 'km', 0.192),
('TRANSPORT', 'Flight', 'km', 0.254),
('TRANSPORT', 'Public Transit', 'km', 0.041),
('ELECTRICITY', 'Electricity Consumption', 'kWh', 0.233),
('FOOD', 'Beef Meal', 'servings', 7.7),
('FOOD', 'Chicken/Pork Meal', 'servings', 1.8),
('FOOD', 'Vegetarian Meal', 'servings', 0.8),
('FOOD', 'Vegan Meal', 'servings', 0.5),
('SHOPPING', 'Clothing', 'USD', 0.4),
('SHOPPING', 'Electronics', 'USD', 0.8),
('SHOPPING', 'General Goods', 'USD', 0.2);

INSERT INTO badges (name, description, criteria_type, criteria_value)
SELECT * FROM (SELECT
    'First Step' AS name, 'Log your first activity' AS description, 'ACTIVITY_COUNT' AS criteria_type, 1 AS criteria_value
    UNION ALL SELECT '10kg Reduction', 'Reduced footprint by 10kg CO2e', 'REDUCTION_AMOUNT', 10
    UNION ALL SELECT 'Goal Achiever', 'Achieve your first sustainability goal', 'GOALS_MET', 1
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE badges.name = seed.name);
