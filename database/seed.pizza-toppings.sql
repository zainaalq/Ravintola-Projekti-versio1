USE pizza_project;

--  Margherita (id = 1)
INSERT INTO pizza_toppings (pizza_id, topping_id, is_default) VALUES
(1, 1, TRUE),   -- Normal crust
(1, 3, TRUE),   -- Tomato sauce
(1, 6, TRUE),   -- Mozzarella
(1, 17, TRUE),  -- Basil
(1, 18, TRUE);  -- Olive oil

-- Pepperoni Pizza (id = 2)
INSERT INTO pizza_toppings (pizza_id, topping_id, is_default) VALUES
(2, 1, TRUE),
(2, 3, TRUE),
(2, 6, TRUE),
(2, 14, TRUE);  -- Pepperoni

-- Hawaiian Pizza (id = 3)
INSERT INTO pizza_toppings (pizza_id, topping_id, is_default) VALUES
(3, 1, TRUE),
(3, 3, TRUE),
(3, 6, TRUE),
(3, 15, TRUE),  -- Ham
(3, 19, TRUE);  -- Pineapple

-- Mixed Veggies Pizza (id = 4)
INSERT INTO pizza_toppings (pizza_id, topping_id, is_default) VALUES
(4, 1, TRUE),
(4, 3, TRUE),
(4, 6, TRUE),
(4, 8, TRUE),   -- Black olives
(4, 9, TRUE),   -- Corn
(4, 10, TRUE),  -- Mushrooms
(4, 11, TRUE),  -- Green peppers
(4, 12, TRUE);  -- Cherry tomatoes

-- Chicken Pesto Pizza (id = 5)
INSERT INTO pizza_toppings (pizza_id, topping_id, is_default) VALUES
(5, 1, TRUE),
(5, 4, TRUE),   -- Pesto sauce
(5, 16, TRUE),  -- Grilled chicken
(5, 13, TRUE),  -- Spinach
(5, 11, TRUE),  -- Green peppers
(5, 6, TRUE),   -- Mozzarella
(5, 7, TRUE);   -- Parmesan

-- BBQ Chicken Pizza (id = 6)
INSERT INTO pizza_toppings (pizza_id, topping_id, is_default) VALUES
(6, 1, TRUE),
(6, 5, TRUE),   -- BBQ sauce
(6, 16, TRUE),  -- Grilled chicken
(6, 6, TRUE),   -- Mozzarella
(6, 20, TRUE);  -- Red onions

-- French Fries & Veg Pizza (id = 7)
INSERT INTO pizza_toppings (pizza_id, topping_id, is_default) VALUES
(7, 1, TRUE),
(7, 3, TRUE),
(7, 6, TRUE),
(7, 9, TRUE),   -- Corn
(7, 10, TRUE),  -- Mushrooms
(7, 11, TRUE),  -- Green peppers
(7, 12, TRUE);  -- Cherry tomatoes

-- Gluten-Free Chicken Pesto Pizza (id = 8)
INSERT INTO pizza_toppings (pizza_id, topping_id, is_default) VALUES
(8, 2, TRUE),   -- Gluten-free crust
(8, 4, TRUE),   -- Pesto sauce
(8, 16, TRUE),  -- Grilled chicken
(8, 13, TRUE),  -- Spinach
(8, 6, TRUE),   -- Mozzarella
(8, 7, TRUE);   -- Parmesan
