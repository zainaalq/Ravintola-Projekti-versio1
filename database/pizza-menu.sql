DROP DATABASE IF EXISTS pizza_project;
CREATE DATABASE pizza_project;
USE pizza_project;

-----------------------------------------------------
-- PIZZAT
-----------------------------------------------------

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  base_price DECIMAL(5,2) NOT NULL,
  image VARCHAR(255)
);

-----------------------------------------------------
-- TÄYTTEET (POHJA, KASTIKE, JUUSTO, TÄYTE)
-----------------------------------------------------

CREATE TABLE toppings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  category ENUM('base', 'sauce', 'cheese', 'topping') NOT NULL,
  selection_type ENUM('single','multi') NOT NULL DEFAULT 'multi'
);

-----------------------------------------------------
-- OLETUSTÄYTTEET PER PIZZA
-----------------------------------------------------

CREATE TABLE pizza_toppings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pizza_id INT NOT NULL,
  topping_id INT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (pizza_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  FOREIGN KEY (topping_id) REFERENCES toppings(id) ON DELETE CASCADE
);

-----------------------------------------------------
-- OSTOSKORI / TILATTU PIZZA
-----------------------------------------------------

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  base_price DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-----------------------------------------------------
-- TILAUKSEN TÄYTTEET (single & multi valinnat)
-----------------------------------------------------

CREATE TABLE order_item_toppings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_item_id INT NOT NULL,
  topping_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  mode ENUM('single','multi') NOT NULL DEFAULT 'multi',
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  FOREIGN KEY (topping_id) REFERENCES toppings(id) ON DELETE CASCADE
);

-----------------------------------------------------
-- TÄYTTEIDEN LISÄYS (oikeat id:t)
-----------------------------------------------------

INSERT INTO toppings (name, price, category, selection_type) VALUES
('Normal crust',        0.00, 'base',   'single'),   -- id 1
('Gluten-free crust',   0.50, 'base',   'single'),   -- id 2

('Tomato sauce',        0.00, 'sauce',  'single'),   -- id 3
('Pesto sauce',         0.00, 'sauce',  'single'),   -- id 4
('BBQ sauce',           0.00, 'sauce',  'single'),   -- id 5
('Olive oil',           0.00, 'sauce',  'single'),   -- id 6

('Mozzarella',          0.00, 'cheese', 'multi'),    -- id 7
('Parmesan',            1.00, 'cheese', 'multi'),    -- id 8

('Black olives',        0.50, 'topping','multi'),    -- id 9
('Corn',                0.50, 'topping','multi'),    -- id 10
('Mushrooms',           0.60, 'topping','multi'),    -- id 11
('Green peppers',       0.50, 'topping','multi'),    -- id 12
('Cherry tomatoes',     0.70, 'topping','multi'),    -- id 13
('Spinach',             0.60, 'topping','multi'),    -- id 14
('Basil',               0.30, 'topping','multi'),    -- id 15
('Pineapple',           0.80, 'topping','multi'),    -- id 16
('Red onions',          0.50, 'topping','multi'),    -- id 17
('Pepperoni',           1.50, 'topping','multi'),    -- id 18
('Ham',                 1.40, 'topping','multi'),    -- id 19
('Grilled chicken',     1.80, 'topping','multi');    -- id 20

-----------------------------------------------------
-- PIZZAT (VALMIIT TUOTTEET)
-----------------------------------------------------

INSERT INTO menu_items (name, description, base_price, image) VALUES
('Margherita',
 'Classic pizza with tomato sauce, mozzarella and basil.',
 10.90,
 'margherita.png'),

('Pepperoni',
 'Tomato sauce, mozzarella and pepperoni.',
 12.50,
 'pepperoni.png'),

('Hawaiian',
 'Tomato sauce, mozzarella, ham and pineapple.',
 11.80,
 'hawaiian.png'),

('Mix',
 'Tomato sauce, mozzarella and mixed vegetables.',
 11.40,
 'mix.pizza.png'),

('Chicken Pesto',
 'Pesto sauce, chicken, mozzarella and parmesan.',
 13.50,
 'chicken_pesto.png'),

('BBQ Chicken',
 'BBQ sauce, chicken, red onions and mozzarella.',
 12.80,
 'bbq_chicken.png'),

('Fries & Veggies',
 'Tomato sauce, mozzarella, fries and vegetables.',
 11.90,
 'french_fries_veggie.png'),

('Gluten-Free Pesto',
 'Gluten-free crust with pesto, chicken and mozzarella.',
 13.90,
 'gluten_free_chicken_pesto.png');

-----------------------------------------------------
-- OLETUSTÄYTTEET PIZZOILLE (KORJATUT JA OIKEAT)
-----------------------------------------------------

-- Margherita
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(1, 1),  
(1, 3),  
(1, 7),  
(1, 15), 
(1, 6);

-- Pepperoni
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(2, 1),
(2, 3),
(2, 7),
(2, 18);

-- Hawaiian
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(3, 1),
(3, 3),
(3, 7),
(3, 19),
(3, 16);

-- Mix (veggie mix)
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(4, 1),
(4, 3),
(4, 7),
(4, 9),
(4, 10),
(4, 11),
(4, 12);

-- Chicken Pesto
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(5, 1),
(5, 4),
(5, 20),
(5, 14),
(5, 7),
(5, 8);

-- BBQ Chicken
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(6, 1),
(6, 5),
(6, 20),
(6, 7),
(6, 17);

-- Fries & Veggies
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(7, 1),
(7, 3),
(7, 7),
(7, 10),
(7, 11),
(7, 12);

-- Gluten-Free Pesto
INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES
(8, 2),
(8, 4),
(8, 20),
(8, 7),
(8, 14);
