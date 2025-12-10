USE pizza_project;




CREATE TABLE drinks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(255)
);


CREATE TABLE drink_sizes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  drink_id INT NOT NULL,
  size ENUM('Small', 'Large') NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (drink_id) REFERENCES drinks(id) ON DELETE CASCADE
);



INSERT INTO drinks (name, image) VALUES
('Coca-Cola',      'coca_cola.png'),
('Pepsi',          'pepsi.png'),
('Fanta Orange',   'fanta.png'),
('Sprite',         'sprite.png'),
('Red Bull',       'red_bull.png'),
('Apple Juice',    'apple_j.png'),
('Orange Juice',   'orange_juice.png'),
('Smoothie',       'smoothie.png');




INSERT INTO drink_sizes (drink_id, size, price) VALUES
(1, 'Small', 2.80), (1, 'Large', 3.99);

INSERT INTO drink_sizes (drink_id, size, price) VALUES
(2, 'Small', 2.50), (2, 'Large', 3.50);

INSERT INTO drink_sizes (drink_id, size, price) VALUES
(3, 'Small', 2.50), (3, 'Large', 3.50);

INSERT INTO drink_sizes (drink_id, size, price) VALUES
(4, 'Small', 2.50), (4, 'Large', 3.50);

INSERT INTO drink_sizes (drink_id, size, price) VALUES
(5, 'Small', 3.00), (5, 'Large', 4.00);

INSERT INTO drink_sizes (drink_id, size, price) VALUES
(6, 'Small', 2.80), (6, 'Large', 3.80);

INSERT INTO drink_sizes (drink_id, size, price) VALUES
(7, 'Small', 2.80), (7, 'Large', 3.80);


INSERT INTO drink_sizes (drink_id, size, price) VALUES
(8, 'Small', 3.90), (8, 'Large', 4.99);
