// Create dependencies
const mysql = require("mysql");
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Global variables
var productArr = [];
var lowInvArr = [];
var oldQty;
var newQty;

// Establish connection to database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Tardis1011",
    database: "bamazon"
});

// Establish connection to server
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    inquireForm();
});

//  Show formatted products table from the bamazon database
function displayInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var tempArry =
            {
                ID: res[i].id,
                Product: res[i].product,
                Department: res[i].department,
                Price: res[i].price,
                Qty: res[i].quantity
            }
            productArr.push(tempArry);
        };
        console.table('\nBamazon Inventory', productArr);
        console.log("-----------------------------------------------------\n");
        productArr = [],
        inquireForm();
    });
}

//  Show formatted product table where quantity is less than 5
function lowInventoryReport() {
    connection.query("SELECT * FROM products WHERE quantity <= 5", function (err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log("Good news! Everything is stocked up!\n");
        } else {
            for (var i = 0; i < res.length; i++) {
                var tempArry =
                {
                    ID: res[i].id,
                    Product: res[i].product,
                    Department: res[i].department,
                    Price: res[i].price,
                    Qty: res[i].quantity
                }
                lowInvArr.push(tempArry);
            }
            console.table('\nBamazon Low Inventory', lowInvArr);
            console.log("-----------------------------------------------------\n");
            lowInvArr = [];
        }
        inquireForm();
    });
}

// Take input from Manager and add that value to the bamazon database product id
function addInventory() {
    inquirer.prompt([
        {
            name: "prodID",
            message: "Type Product ID number to add more inventory"
        },
        {
            name: "quantityValue",
            message: "Type the amount of inventory you want to add"
        }
    ]).then(function (answers) {
        var productID = answers.prodID;
        var quantityValue = answers.quantityValue;
        // Query bamazon database and find row where id = productID
        connection.query("SELECT * FROM products WHERE id = " + productID,
            function (err, res) {
                if (err) throw err;
                newQty = parseInt(quantityValue) + res[0].quantity;
                // Update the row's quantity with the calculated newQty value
                connection.query("UPDATE products SET ? WHERE ?",
                [
                  {
                    quantity: newQty
                  },
                  {
                    id: productID
                  }
                ],
                function (err, res) {
                    if (err) throw err;
                    displayInventory();
            });
        });
    });
}

//  Add new row to bamazon database products table
function addProduct() {
    inquirer.prompt([
        {
            name: "product",
            message: "Type the Product Name"
        },
        {
            name: "department",
            message: "Select a Department",
            type:  "list",
            choices:  ["Books", "Computers", "Food", "Office Supplies"]
        },
        {
            name: "price",
            message: "Enter Price"
        },
        {
            name: "quantity",
            message: "Enter Quantity"
        }
    ]).then(function (answers) {
        var name = answers.product;
        var department = answers.department;
        var price = answers.price;
        var quantity = answers.quantity;
        connection.query("INSERT INTO products SET ?",
            {
                product: name,
                department: department,
                price: price,
                quantity: quantity,
            },
            function (err, res) {
                if (err) throw err;
                displayInventory();
            });
    });
}

//  Initial manager prompt
function inquireForm() {
    inquirer.prompt([
        {
            name: "managerRequest",
            message: "Select manager function",
            type:  "list",
            choices:  ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Close Application"]

        }
    ]).then(function (answers) {
        var answer = answers.managerRequest;

        switch (answer) {
            case "View Products for Sale":
                displayInventory ();
                break;
            case "View Low Inventory":
                lowInventoryReport();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Close Application":
                console.log("Good bye!");
                connection.end();
                break;
            default: 
                text = "Say what now?";
                inquireForm();
        }
    });
}