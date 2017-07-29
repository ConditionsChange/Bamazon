-- create database
-- use database
-- create table

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NULL,
	department_name VARCHAR(100) NULL,
	price DECIMAL(10,2) NULL,
	stock_quantity INT NULL,
  	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Playstation 4", "electronics", 300, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nikon D5", "electronics", 5000, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cheeze-It Snack Box", "food", 10, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Face Mirror", "bathroom", 23, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Keurig Coffee Brewer", "appliances", 140, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Black+Decker Cordless Drill", "hand tools", 50, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Harry Potter and the Cursed Child Playscript", "books", 8.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Head and Shoulders Classic", "bathroom", 7.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Women's Sandals", "clothes", 12.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Men's Board Shorts", "clothes", 13.29, 20);