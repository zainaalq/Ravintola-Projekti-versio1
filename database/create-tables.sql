USE pizza_project;

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(6,2) NOT NULL,
  image VARCHAR(255)
);

CREATE TABLE toppings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  category VARCHAR(255),
  image VARCHAR(255)
);

CREATE TABLE pizza_toppings (
  pizza_id INT NOT NULL,
  topping_id INT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (pizza_id) REFERENCES menu_items(id),
  FOREIGN KEY (topping_id) REFERENCES toppings(id)
);
