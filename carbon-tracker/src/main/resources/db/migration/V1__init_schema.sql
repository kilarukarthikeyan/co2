CREATE TABLE organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    organization_id BIGINT,
    sustainability_preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE emission_factors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    factor_value DECIMAL(10, 4) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY uk_factor (category, activity_type, unit)
);

CREATE TABLE activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    log_date DATE NOT NULL,
    calculated_co2e DECIMAL(10, 4) NOT NULL,
    memo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_reduction_percentage DECIMAL(5, 2) NOT NULL,
    target_value DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    criteria_type VARCHAR(50) NOT NULL,
    criteria_value DECIMAL(10, 2) NOT NULL
);

CREATE TABLE user_badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    awarded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ub_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_ub_badge FOREIGN KEY (badge_id) REFERENCES badges(id)
);

-- Insert basic initial emission factors (examples based on IPCC/EPA approx values)
INSERT INTO emission_factors (category, activity_type, unit, factor_value) VALUES
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

-- Insert basic badges
INSERT INTO badges (name, description, criteria_type, criteria_value) VALUES
('First Step', 'Log your first activity', 'ACTIVITY_COUNT', 1),
('10kg Reduction', 'Reduced footprint by 10kg CO2e', 'REDUCTION_AMOUNT', 10),
('Goal Achiever', 'Achieve your first sustainability goal', 'GOALS_MET', 1);
