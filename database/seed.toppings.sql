USE pizza_project;

INSERT INTO toppings (name, price, category, image) VALUES
--  Pizza crust options
('Normal crust', 0.00, 'base', 'normal-crust.png'),
('Gluten-free crust', 1.50, 'base', 'gluten-free-crust.png'),

--  Sauces
('Tomato sauce', 0.00, 'sauce', 'tomato-sauce.png'),
('Pesto sauce', 1.00, 'sauce', 'pesto-sauce.png'),
('BBQ sauce', 1.00, 'sauce', 'bbq-sauce.png'),

-- Cheese options
('Mozzarella', 0.00, 'cheese', 'mozzarella.png'),
('Parmesan', 1.00, 'cheese', 'parmesan.png'),

--  Vegetables
('Black olives', 0.50, 'veggie', 'black-olives.png'),
('Corn', 0.50, 'veggie', 'corn.png'),
('Mushrooms', 0.60, 'veggie', 'mushrooms.png'),
('Green peppers', 0.50, 'veggie', 'green-peppers.png'),
('Cherry tomatoes', 0.70, 'veggie', 'cherry-tomatoes.png'),
('Spinach', 0.60, 'veggie', 'spinach.png'),

--  Meat toppings
('Pepperoni', 1.50, 'meat', 'pepperoni.png'),
('Ham', 1.40, 'meat', 'ham.png'),
('Grilled chicken', 1.80, 'meat', 'grilled-chicken.png');


INSERT INTO toppings (name, price, category, image) VALUES
('Basil', 0.30, 'veggie', 'basil.png'),
('Olive oil', 0.20, 'sauce', 'olive-oil.png'),
('Pineapple', 0.80, 'veggie', 'pineapple.png'),
('Red onions', 0.50, 'veggie', 'red-onions.png');
