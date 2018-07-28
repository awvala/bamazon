// Create dependencies
const mysql = require("mysql");
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Global variables
var productArr = [];
var lowInvArr = [];

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
        inquireForm();
    });
}

//  Show formatted product table where quantity is less than 5
function lowInventoryReport() {
    connection.query("SELECT * FROM products WHERE quantity <= 50", function (err, res) {
        //if (err) throw err;
        console.log(res.length);
        if (res.length = 0) {
            console.log("Good news! Everything is stocked up!");
        } else {
            console.log("Hello");
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var tempArry =
                {
                    ID: res[i].id,
                    Product: res[i].product,
                    Department: res[i].department,
                    Price: res[i].price,
                    Qty: res[i].quantity
                }
                console.log(tempArry);
                lowInvArr.push(tempArry);
            }
            console.table('\nBamazon Low Inventory', lowInvArr);
        }
        inquireForm();
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
                //updateSong();
                break;
            case "Add New Product":
                //deleteSong();
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