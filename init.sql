
USE shopdb;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

INSERT INTO products (name, price) VALUES
('Laptop', 350000),
('Mouse', 5000),
('Keyboard', 15000);
