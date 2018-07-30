DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INTEGER(10) NOT NULL AUTO_INCREMENT,
product VARCHAR(50) NOT NULL,
department VARCHAR (50) NOT NULL,
price INTEGER(10) NOT NULL,
quantity INTEGER(10) DEFAULT 0,
sales INTEGER(10) DEFAULT 0,
PRIMARY KEY(id)
);

INSERT INTO products (id, product, department, price, quantity, sales)
VALUES
	(1,'Pencil Case', 'Office Supplies',5,100,10000),
	(2,'Beginning Database Design','Books',18,10,10000),
	(3,'Geekper Giant Inflatable Unicorn Pool Float','Toys',7,38,10000),
	(4,'Uno Card Game','Toys',5,50,10000),
	(5,'Oathbringer','Books',17,37,10000),
	(6,'The Way of Kings','Books',10,62,10000),
	(7,'Words of Radiance','Books',10,46,10000),
	(8,'Ergonomic Wireless Mouse 2.4 GHz','Computers',12,78,10000),
	(9,'4 Port USB 3.0 Ultra Slim Data Hub','Computers',8,200,10000),
	(10,'Bramble Brand Bran Cookies','Food',8,93,10000);

CREATE TABLE departments (
department_id INTEGER(10) NOT NULL AUTO_INCREMENT,
department_name VARCHAR(30) NOT NULL,
over_head_costs INTEGER(50),
PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name,over_head_costs) 
VALUES 
	('Books', 20000),
    ('Computers', 50000),
    ('Food', 5000),
    ('Office Supplies', 1000),
    ('Toys', 15000);


# 
#USE bamazon;

#SELECT  d.department_id, d.department_name, d.over_head_costs, SUM(p.sales) AS product_sales, (SUM(p.sales)-d.over_head_costs) AS total_profit
#	FROM departments AS d
#    INNER JOIN products AS p 
#    ON department_name = p.department
#    GROUP BY department_id
#    ORDER BY department_id ASC;