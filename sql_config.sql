DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INTEGER(10) NOT NULL AUTO_INCREMENT,
product VARCHAR(50) NOT NULL,
department VARCHAR (50) NOT NULL,
price INTEGER(10) NOT NULL,
quantity INTEGER(10) DEFAULT 0,
product_sales INTEGER(10),
PRIMARY KEY(id)
);

CREATE TABLE departments (
department_id INTEGER(10) NOT NULL AUTO_INCREMENT,
department_name VARCHAR(30) NOT NULL,
over_head_costs INTEGER(50),
PRIMARY KEY(department_id)
);