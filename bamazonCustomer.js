// Create dependencies
const mysql = require("mysql");
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Global variables
var productArr = [];

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
    displayInventory();
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
        inquireForm();
    });
}

//  Update the products table in the bamazon database and display customer purchase cost
function makepurchase(itemID, arrayID, itemQty, reqQty) {
    var newQty = (parseInt(itemQty) - parseInt(reqQty));
    connection.query("UPDATE products SET quantity = " + newQty + " WHERE id = " + itemID,
        function (err, res) {
            if (err) throw err;
            var cost = (productArr[arrayID].Price*reqQty);
            console.log("Congrats! You ordered " + reqQty + " " + (productArr[arrayID].Product) + "(s) for $" + cost + ".");
            connection.end();
        }
    )
}

//  Initial customer order prompt
function inquireForm() {
    inquirer.prompt([
        {
            name: "productId",
            message: "Type the ID of the item you would like to purchase.",
        },
        {
            name: "quantity",
            message: "How many?",
        }
    ]).then(function (answers) {
        var itemID = answers.productId;
        var arrayID = (parseInt(itemID) - 1);
        var itemQty = productArr[arrayID].Qty;
        var reqQty = answers.quantity;

        if (reqQty > itemQty) {
            console.log("Insuficient Quantity!");
            productArr = [];
            displayInventory();
        } else {
            makepurchase(itemID, arrayID, itemQty, reqQty);
        }
    });
}