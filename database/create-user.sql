CREATE USER 'pizzauser'@'localhost' IDENTIFIED BY 'pizzapassword';
GRANT ALL PRIVILEGES ON pizza_project.* TO 'pizzauser'@'localhost';
FLUSH PRIVILEGES;
