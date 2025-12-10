CREATE TABLE IF NOT EXISTS daily_deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deal_date DATE NOT NULL,
    pizza_id INT NOT NULL,
    drink_id INT NOT NULL,
    discount INT DEFAULT 20,
    UNIQUE KEY (deal_date)
);
